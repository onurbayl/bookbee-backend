import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from 'src/app/book/book.repository';
import { UserRepository } from 'src/app/user/user.repository';
import { GenreRepository } from 'src/app/genre/genre.repository';
import { Genre } from "src/app/genre/genre.entity";
import { GenreService } from 'src/app/genre/genre.service';

describe('GenreService', () => {
    let genreService: GenreService;
    let genreRepository: Partial<GenreRepository>;

    beforeEach(async () => {

        genreRepository = {
            findGenre: jest.fn(),
            findAll: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
          providers: [
            GenreService,
            { provide: GenreRepository, useValue: genreRepository },
          ],
        }).compile();
    
        genreService = module.get<GenreService>(GenreService);
    });

    describe('fetchAllGenres', () => {
        it('Success_Fetch', async () => {

        const mockGenreList: Genre[] = [];
        const mockGenre1 = new Genre();
        const mockGenre2 = new Genre();
        mockGenreList.push(mockGenre1);
        mockGenreList.push(mockGenre2);

        (genreRepository.findAll as jest.Mock).mockResolvedValue(mockGenreList);

        const expectedResult: Genre[] = [];
        expectedResult.push(mockGenre1);
        expectedResult.push(mockGenre2);

        const result = await genreService.fetchAllGenres();

        expect(result).toEqual(expectedResult);
        expect(genreRepository.findAll).toHaveBeenCalledWith();

        }); 
    });
});