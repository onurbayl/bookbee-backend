import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Client } from 'pg';  // PostgreSQL client
import * as fs from 'fs';  // To read SQL files
import * as path from 'path';
import { ConfigService } from '@nestjs/config';  // To access config
import { TestModule } from 'test/test.module';
import * as firebaseAdmin from 'firebase-admin';

describe('BookController', () => {
    let app;
    let module: TestingModule;
    let client: Client;  // PostgreSQL client instance
    let configService: ConfigService;  // To access database config   

    const loadSQLFile = async (sqlFilePath: string) => {
        try {
            // Read SQL file contents
            const sql = fs.readFileSync(path.resolve(sqlFilePath), 'utf-8');
            
            // Split SQL file content into individual statements
            const statements = sql.split(';');
            for (const statement of statements) {
            const trimmedStatement = statement.trim();
            
            // Skip comment lines that start with "--" or empty statements
            if (trimmedStatement.startsWith('--') || !trimmedStatement) {
                continue;
            }

            // Skip any "CREATE DATABASE" statements (they can't be executed inside a transaction block)
            if (trimmedStatement.toUpperCase().startsWith('CREATE DATABASE')) {
                continue;  // Skip this statement
            }

            try {
                // Execute each statement individually
                await client.query(trimmedStatement);  
            } catch (error) {
                // Handle specific cases where errors are expected
                if (error.message.includes('already exists')) {
                console.warn(`Skipping error: ${error.message}`);
                } else {
                console.error('Error executing SQL statement:', error);
                throw error; // Re-throw error if it's not expected (i.e., not "already exists")
                }
            }
            }
        } catch (error) {
            console.error('Error loading SQL file:', error);
            throw error;
        }
    };
  
    // Utility function to clean the database
    const cleanDatabase = async () => {
        try {
            // Drop all tables in the public schema before reloading the SQL file
            await client.query('DROP SCHEMA IF EXISTS public CASCADE;');  // Drop schema and everything in it
            await client.query('CREATE SCHEMA public;');  // Recreate the schema
        } catch (error) {
            console.error('Error cleaning the schema:', error);
            throw error;
        }
    };

    beforeAll(async () => {

        // Initialize NestJS testing module
        module = await Test.createTestingModule({
            imports: [TestModule],  // Import both AppModule and TestModule
        }).compile();

        app = module.createNestApplication();
        await app.init();

        const firebaseKeyFilePath = './bookbee-b6db9-firebase-adminsdk-90poz-4ae4135c22.json'
        const firebaseServiceAccount = JSON.parse(
        fs.readFileSync(firebaseKeyFilePath).toString(),
        );

        if(firebaseAdmin.apps.length === 0){
            console.log('Initialize Firebase Application.');
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
            });
        }

        // Retrieve ConfigService from the testing module
        configService = module.get<ConfigService>(ConfigService);

        // Access PostgreSQL database config from environment variables or ConfigService
        const dbConfig = {
            user: 'postgres',   // Hard-coded user 'postgres'
            host: 'localhost',  // Hard-coded host
            database: 'test_db',// Hard-coded database name
            password: '123456', // Hard-coded password (replace with your password)
            port: 5432,         // Hard-coded port
        };

        // Initialize PostgreSQL client
        client = new Client(dbConfig);
        await client.connect();  // Connect to PostgreSQL
    });

    beforeEach(async () => {
        // Clean up the schema and recreate it
        await cleanDatabase();

        // Load the SQL file to recreate tables and insert mock data
        await loadSQLFile('./test/test_dataset.sql');
    });

    afterAll(async () => {
        // Close PostgreSQL client connection
        await client.end();
        await app.close();
    });

    describe('/api/v1/cart-item/get-items', () => {

        it('Success', async () => {

            const loginBody = {
                'email': 'john.doe@example.com',
                'password': '12345678'
            };

            const login = await request(app.getHttpServer())
            .post('/api/v1/user/login')
            .send(loginBody)
            .expect(201);

            const bearerToken = login.body.idToken;

            const response = await request(app.getHttpServer())
            .get('/api/v1/cart-item/get-items')
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.length).toEqual(5);
        });

    });

    describe('/api/v1/cart-item/add-item/:bookId', () => {

        it('Success', async () => {

            const loginBody = {
                'email': 'john.doe@example.com',
                'password': '12345678'
            };

            const login = await request(app.getHttpServer())
            .post('/api/v1/user/login')
            .send(loginBody)
            .expect(201);

            const bearerToken = login.body.idToken;

            const response = await request(app.getHttpServer())
            .patch('/api/v1/cart-item/add-item/4')
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.book.name).toEqual('Romance in Paris');
        });

    });

    describe('/api/v1/cart-item/remove-item/:bookId', () => {

        it('Success_Removed', async () => {

            const loginBody = {
                'email': 'john.doe@example.com',
                'password': '12345678'
            };

            const login = await request(app.getHttpServer())
            .post('/api/v1/user/login')
            .send(loginBody)
            .expect(201);

            const bearerToken = login.body.idToken;

            const response = await request(app.getHttpServer())
            .patch('/api/v1/cart-item/remove-item/30')
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.message).toEqual('This item with ID 30 removed from shopping cart.');
        });

        it('Success_Decrase', async () => {

            const loginBody = {
                'email': 'john.doe@example.com',
                'password': '12345678'
            };

            const login = await request(app.getHttpServer())
            .post('/api/v1/user/login')
            .send(loginBody)
            .expect(201);

            const bearerToken = login.body.idToken;

            const response = await request(app.getHttpServer())
            .patch('/api/v1/cart-item/remove-item/3')
            .set('Authorization', `Bearer ${bearerToken}`)
            .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.quantity).toEqual(1);
        });

    });

});