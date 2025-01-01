import { Controller, Get, UseGuards, Post, Request, Patch, Delete, ForbiddenException, Param, NotFoundException, ValidationPipe, UsePipes, BadRequestException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from "src/guards/auth.guard";
import { createNewBookDto } from "./dtos/create-new-book-dto";
import { RestrictedBookOpException } from "./exceptions/restricted-book-op.exception"


@Controller('api/v1/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('get-bookName/:bookName')
  async findBookByName(@Param('bookName') bookName: string) {
    const book = await this.bookService.findBookByName(bookName);
    return book;
  }

  @Get('get-bookId/:bookId')
  async findBookById(@Param('bookId') bookId: number) {
    const book = await this.bookService.findBookById(bookId);
    return book;
  }

  @Get('get-publisher-bookId/:bookId')
  @UseGuards(AuthGuard)
  async findPublisherBookById(@Param('bookId') bookId: number, @Request() req) {
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Get();
    }
    const book = await this.bookService.findPublisherBookById(bookId, uId);
    return book;
  }

  @Get('get-all-books')
  async fetchAllBooks() {
    const book = await this.bookService.getAllBooks();
    return book;
  }

  @Get('get-all-books-wishlist')
  async fetchAllBooksWishlist() {
    const book = await this.bookService.getAllBooksWishlist();
    return book;
  }

  @Get('get-publisher-books')
  @UseGuards(AuthGuard)
  async findPublisherBooks( @Request() req ) {
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Get();
    }
    const books = await this.bookService.findPublisherBooks(uId);
    return books;
  }

  @Post('upload-book')
  @UseGuards(AuthGuard)
  async uploadBook( @Body() createBookDto: createNewBookDto, @Request() req ){
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Upload();
    }
    const result = await this.bookService.uploadBook(createBookDto, uId);
    return result;
  }

  @Patch('update-book/:bookId')
  @UseGuards(AuthGuard)
  async updateBook( @Param('bookId') bookId: number, @Body() createBookDto: createNewBookDto, @Request() req ){
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Upload();
    }
    const result = await this.bookService.updateBook(bookId, createBookDto, uId);
    return result;
  }

  @Delete('delete-book/:bookId')
  @UseGuards(AuthGuard)
  async deleteBook(@Param('bookId') bookId: number, @Request() req ){
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Delete();
    }

    const result = await this.bookService.deleteBook(bookId, uId);
    return result;

  }

  @Get('get-deleted-publisher-books')
  @UseGuards(AuthGuard)
  async findDeletedPublisherBooks( @Request() req ) {
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Delete();
    }
    const books = await this.bookService.findDeletedPublisherBooks(uId);
    return books;
  }

  @Post('reupload-book/:bookId')
  @UseGuards(AuthGuard)
  async reuploadBook( @Param('bookId') bookId: number, @Request() req ){
    const uId = req.user.uid;
    if ( req.user.role != 'publisher' && req.user.role != 'admin') {
      RestrictedBookOpException.Upload();
    }
    const result = await this.bookService.reuploadBook(bookId, uId);
    return result;
  }
}