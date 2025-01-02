--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-01-02 20:25:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5070 (class 1262 OID 16388)
-- Name: bookbee_backend_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE bookbee_backend_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE bookbee_backend_db OWNER TO postgres;

\connect bookbee_backend_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16703)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16724)
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2048) NOT NULL,
    price numeric NOT NULL,
    writer character varying(255) NOT NULL,
    "pageNumber" integer NOT NULL,
    "datePublished" integer NOT NULL,
    language character varying(255) NOT NULL,
    "bookDimension" character varying(255) NOT NULL,
    barcode character varying(255) NOT NULL,
    isbn character varying(255) NOT NULL,
    "editionNumber" character varying(255) NOT NULL,
    "imagePath" character varying(255) NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    publisher_id integer
);


ALTER TABLE public.book OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 16854)
-- Name: book_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_genres (
    book_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.book_genres OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16723)
-- Name: book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_id_seq OWNER TO postgres;

--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 221
-- Name: book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_id_seq OWNED BY public.book.id;


--
-- TOC entry 246 (class 1259 OID 16821)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    cart_id integer,
    book_id integer
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16820)
-- Name: cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_item_id_seq OWNER TO postgres;

--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 245
-- Name: cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_item_id_seq OWNED BY public.cart_item.id;


--
-- TOC entry 236 (class 1259 OID 16781)
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    content character varying(2048) NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    user_id integer,
    review_id integer
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16780)
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_seq OWNER TO postgres;

--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 235
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- TOC entry 238 (class 1259 OID 16790)
-- Name: comment_like_dislike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_like_dislike (
    id integer NOT NULL,
    "likeDislike" integer NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    user_id integer,
    comment_id integer
);


ALTER TABLE public.comment_like_dislike OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16789)
-- Name: comment_like_dislike_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_like_dislike_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_like_dislike_id_seq OWNER TO postgres;

--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 237
-- Name: comment_like_dislike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_like_dislike_id_seq OWNED BY public.comment_like_dislike.id;


--
-- TOC entry 242 (class 1259 OID 16804)
-- Name: coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon (
    id integer NOT NULL,
    "discountPercentage" integer NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    user_id integer
);


ALTER TABLE public.coupon OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16803)
-- Name: coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupon_id_seq OWNER TO postgres;

--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 241
-- Name: coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupon_id_seq OWNED BY public.coupon.id;


--
-- TOC entry 224 (class 1259 OID 16734)
-- Name: customer_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_address (
    id integer NOT NULL,
    "addressInfo" character varying(2048) NOT NULL,
    current boolean DEFAULT true NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone,
    user_id integer
);


ALTER TABLE public.customer_address OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16733)
-- Name: customer_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_address_id_seq OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 223
-- Name: customer_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_address_id_seq OWNED BY public.customer_address.id;


--
-- TOC entry 240 (class 1259 OID 16797)
-- Name: discount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount (
    id integer NOT NULL,
    "discountPercentage" integer NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    book_id integer
);


ALTER TABLE public.discount OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16796)
-- Name: discount_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_id_seq OWNER TO postgres;

--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 239
-- Name: discount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_id_seq OWNED BY public.discount.id;


--
-- TOC entry 226 (class 1259 OID 16744)
-- Name: friend_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.friend_request (
    id integer NOT NULL,
    "dateRequest" timestamp without time zone NOT NULL,
    "dateAnswered" timestamp without time zone,
    sender_id integer,
    reciever_id integer
);


ALTER TABLE public.friend_request OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16743)
-- Name: friend_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.friend_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friend_request_id_seq OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 225
-- Name: friend_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.friend_request_id_seq OWNED BY public.friend_request.id;


--
-- TOC entry 218 (class 1259 OID 16705)
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    id integer NOT NULL,
    name character varying(256) NOT NULL
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16704)
-- Name: genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genre_id_seq OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 217
-- Name: genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genre_id_seq OWNED BY public.genre.id;


--
-- TOC entry 248 (class 1259 OID 16828)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id integer NOT NULL,
    "orderDate" timestamp without time zone NOT NULL,
    "totalPrice" numeric NOT NULL,
    user_id integer,
    address_id integer,
    used_coupon_id integer
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16827)
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;


--
-- TOC entry 250 (class 1259 OID 16839)
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric NOT NULL,
    order_id integer,
    book_id integer,
    discount_id integer
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16838)
-- Name: order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_item_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 249
-- Name: order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_item_id_seq OWNED BY public.order_item.id;


--
-- TOC entry 228 (class 1259 OID 16751)
-- Name: read_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.read_status (
    id integer NOT NULL,
    status character varying(256) NOT NULL,
    "readDate" timestamp without time zone NOT NULL,
    user_id integer,
    book_id integer
);


ALTER TABLE public.read_status OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16750)
-- Name: read_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.read_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.read_status_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 227
-- Name: read_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.read_status_id_seq OWNED BY public.read_status.id;


--
-- TOC entry 232 (class 1259 OID 16765)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id integer NOT NULL,
    score integer NOT NULL,
    content character varying NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    user_id integer,
    book_id integer
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16764)
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 231
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- TOC entry 234 (class 1259 OID 16774)
-- Name: review_like_dislike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_like_dislike (
    id integer NOT NULL,
    "likeDislike" integer NOT NULL,
    "dateCreated" timestamp without time zone NOT NULL,
    user_id integer,
    review_id integer
);


ALTER TABLE public.review_like_dislike OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16773)
-- Name: review_like_dislike_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_like_dislike_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_like_dislike_id_seq OWNER TO postgres;

--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 233
-- Name: review_like_dislike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_like_dislike_id_seq OWNED BY public.review_like_dislike.id;


--
-- TOC entry 244 (class 1259 OID 16812)
-- Name: shopping_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_cart (
    id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.shopping_cart OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16811)
-- Name: shopping_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_cart_id_seq OWNER TO postgres;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 243
-- Name: shopping_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_cart_id_seq OWNED BY public.shopping_cart.id;


--
-- TOC entry 220 (class 1259 OID 16714)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    uid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "imagePath" character varying(255) NOT NULL,
    balance numeric(15,2) NOT NULL,
    description character varying(2048) NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16847)
-- Name: user_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_genres (
    user_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.user_genres OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16713)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 230 (class 1259 OID 16758)
-- Name: wish_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wish_list (
    id integer NOT NULL,
    "dateAdded" timestamp without time zone NOT NULL,
    user_id integer,
    book_id integer
);


ALTER TABLE public.wish_list OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16757)
-- Name: wish_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wish_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wish_list_id_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 229
-- Name: wish_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wish_list_id_seq OWNED BY public.wish_list.id;


--
-- TOC entry 4787 (class 2604 OID 16727)
-- Name: book id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);


--
-- TOC entry 4802 (class 2604 OID 16824)
-- Name: cart_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item ALTER COLUMN id SET DEFAULT nextval('public.cart_item_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 16784)
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 16793)
-- Name: comment_like_dislike id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_like_dislike ALTER COLUMN id SET DEFAULT nextval('public.comment_like_dislike_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 16807)
-- Name: coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon ALTER COLUMN id SET DEFAULT nextval('public.coupon_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16737)
-- Name: customer_address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address ALTER COLUMN id SET DEFAULT nextval('public.customer_address_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 16800)
-- Name: discount id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public.discount_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 16747)
-- Name: friend_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_request ALTER COLUMN id SET DEFAULT nextval('public.friend_request_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 16708)
-- Name: genre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre ALTER COLUMN id SET DEFAULT nextval('public.genre_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 16831)
-- Name: order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 16842)
-- Name: order_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item ALTER COLUMN id SET DEFAULT nextval('public.order_item_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16754)
-- Name: read_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.read_status ALTER COLUMN id SET DEFAULT nextval('public.read_status_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 16768)
-- Name: review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16777)
-- Name: review_like_dislike id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_like_dislike ALTER COLUMN id SET DEFAULT nextval('public.review_like_dislike_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16815)
-- Name: shopping_cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart ALTER COLUMN id SET DEFAULT nextval('public.shopping_cart_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16717)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 16761)
-- Name: wish_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish_list ALTER COLUMN id SET DEFAULT nextval('public.wish_list_id_seq'::regclass);


--
-- TOC entry 5034 (class 0 OID 16724)
-- Dependencies: 222
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.book VALUES (9, 'Thrilling Heights', 'A suspenseful story full of twists.', 17.99, 'Evelyn Suspense', 275, 2019, 'English', '8x5 inches', '9012345678901', '978-0-14-312774-1', '2', 'bird.png', false, 3);
INSERT INTO public.book VALUES (13, 'Romantic Escapes', 'Beautiful destinations for couples.', 13.99, 'Love Journeys', 240, 2019, 'English', '8x5 inches', '3345678901235', '978-0-7432-7356-5', '1', 'bird.png', false, 3);
INSERT INTO public.book VALUES (16, 'The Oceans Secret', 'A deep dive into the mysteries of the ocean.', 22.99, 'Emma Deep', 300, 2023, 'English', '9x6 inches', '1234567890124', '978-0-316-15321-1', '1', 'bird.png', false, 3);
INSERT INTO public.book VALUES (18, 'The Hidden Truth', 'A gripping thriller with unexpected twists.', 17.99, 'Sarah Stone', 280, 2021, 'English', '7.8x5 inches', '3234567890126', '978-0-316-15323-5', '3', 'bird.png', false, 3);
INSERT INTO public.book VALUES (22, 'The Last Stand', 'An action-packed thriller about a soldier’s last mission.', 20.99, 'Marcus Steel', 320, 2023, 'English', '8x5 inches', '7234567890130', '978-0-316-15327-3', '3', 'bird.png', false, 3);
INSERT INTO public.book VALUES (23, 'Ancient Secrets', 'An archaeological thriller set in Egypt.', 22.00, 'Julia Carter', 280, 2021, 'English', '7.8x5 inches', '8234567890131', '978-0-316-15328-0', '2', 'bird.png', false, 4);
INSERT INTO public.book VALUES (30, 'The Eternal Flame', 'A fantasy epic about a quest for immortality.', 26.00, 'Sylvia Phoenix', 450, 2022, 'English', '8.5x5.5 inches', '1534567890138', '978-0-316-15335-8', '1', 'bird.png', false, 3);
INSERT INTO public.book VALUES (2, 'Mystery at Midnight', 'A thrilling mystery that keeps you guessing.', 14.99, 'Jane Author', 250, 2019, 'English', '7.8x5 inches', '2345678901234', '978-1-23-456789-7', '2', 'castle.png', false, 3);
INSERT INTO public.book VALUES (3, 'Fantasy World Chronicles', 'An immersive fantasy journey.', 24.99, 'Alice Dreamer', 450, 2021, 'English', '9x6 inches', '3456789012345', '978-0-12-345678-9', '3', 'flower.png', false, 4);
INSERT INTO public.book VALUES (4, 'Romance in Paris', 'A heartfelt romance set in the city of love.', 12.99, 'Anna Heart', 200, 2018, 'English', '8x5 inches', '4567890123456', '978-0-19-852663-6', '1', 'girl.png', false, 4);
INSERT INTO public.book VALUES (5, 'Science Fiction Odyssey', 'A futuristic adventure beyond imagination.', 18.50, 'George Space', 380, 2022, 'English', '8.5x5.5 inches', '5678901234567', '978-0-07-111154-9', '1', 'horse.png', false, 3);
INSERT INTO public.book VALUES (7, 'Self-Help Secrets', 'Transform your life with these powerful tips.', 15.99, 'Laura Growth', 250, 2021, 'English', '8x5 inches', '7890123456789', '978-0-13-110362-7', '3', 'castle.png', false, 3);
INSERT INTO public.book VALUES (11, 'Cooking Delights', 'Delicious recipes for everyday meals.', 25.00, 'Chef Goodfood', 180, 2021, 'English', '8x5 inches', '1123456789013', '978-0-465-05671-1', '1', 'castle.png', false, 3);
INSERT INTO public.book VALUES (12, 'Travel Tales', 'Adventures from around the globe.', 19.99, 'Wander Lust', 290, 2018, 'English', '8.5x5.5 inches', '2234567890124', '978-0-316-76948-9', '2', 'flower.png', false, 4);
INSERT INTO public.book VALUES (15, 'Fictional Wonders', 'A collection of short stories.', 18.00, 'Story Weaver', 260, 2022, 'English', '8x5 inches', '5567890123457', '978-0-8129-8655-0', '3', 'castle.png', false, 3);
INSERT INTO public.book VALUES (17, 'Into the Wild', 'An adventure story about survival in the wild.', 19.49, 'John Tracker', 320, 2022, 'English', '8x5 inches', '2234567890125', '978-0-316-15322-8', '2', 'castle.png', false, 4);
INSERT INTO public.book VALUES (19, 'Winter’s End', 'A fantasy novel about the battle between good and evil.', 21.99, 'Liam Frost', 400, 2020, 'English', '9x6 inches', '4234567890127', '978-0-316-15324-2', '2', 'flower.png', false, 4);
INSERT INTO public.book VALUES (21, 'City of Dreams', 'A tale of ambition, dreams, and heartbreak in the city.', 18.50, 'Oliver Metropolis', 300, 2022, 'English', '8x5 inches', '6234567890129', '978-0-316-15326-6', '1', 'horse.png', false, 4);
INSERT INTO public.book VALUES (24, 'The Secret Garden', 'A beautiful tale of growth and redemption.', 15.99, 'Emily Green', 240, 2020, 'English', '8x5 inches', '9234567890132', '978-0-316-15329-7', '1', 'horse.png', false, 3);
INSERT INTO public.book VALUES (1, 'The Great Adventure', 'An epic tale of courage and discovery.', 19.99, 'John Writer', 320, 2020, 'English', '8.5x5.5 inches', '1234567890123', '978-3-16-148410-0', '1', 'jungle.png', false, 3);
INSERT INTO public.book VALUES (6, 'Historical Reflections', 'A dive into the most pivotal events in history.', 22.00, 'Mark History', 320, 2017, 'English', '9x6 inches', '6789012345678', '978-0-14-044913-6', '2', 'night.png', false, 4);
INSERT INTO public.book VALUES (8, 'Biography of a Genius', 'The life story of a remarkable individual.', 20.00, 'David Bio', 300, 2020, 'English', '7.8x5 inches', '8901234567890', '978-0-12-345678-0', '1', 'jungle.png', false, 4);
INSERT INTO public.book VALUES (10, 'Fantasy Realm', 'A magical world of wonder and danger.', 21.50, 'Fantasy Author', 400, 2022, 'English', '9x6 inches', '0123456789012', '978-0-06-112008-4', '3', 'night.png', false, 4);
INSERT INTO public.book VALUES (14, 'Mindful Living', 'Practical steps to a mindful life.', 16.50, 'Zen Thinker', 210, 2020, 'English', '7.8x5 inches', '4456789012346', '978-1-5011-8747-7', '2', 'jungle.png', false, 4);
INSERT INTO public.book VALUES (20, 'Heart of the Ocean', 'A historical fiction novel set in the 18th century.', 25.00, 'Catherine Wave', 350, 2021, 'English', '8.5x5.5 inches', '5234567890128', '978-0-316-15325-9', '1', 'jungle.png', false, 3);
INSERT INTO public.book VALUES (27, 'The Timekeeper’s Legacy', 'A time-travel adventure that spans centuries.', 23.99, 'George Chrono', 350, 2023, 'English', '9x6 inches', '1234567890135', '978-0-316-15332-7', '1', 'night.png', false, 4);
INSERT INTO public.book VALUES (25, 'Codebreaker', 'A fast-paced novel about cryptography and espionage.', 19.50, 'Lucas Cipher', 310, 2022, 'English', '8.5x5.5 inches', '1034567890133', '978-0-316-15330-3', '2', 'castle.png', false, 4);
INSERT INTO public.book VALUES (26, 'In the Shadows', 'A psychological thriller with a dark twist.', 17.50, 'Nina Night', 270, 2021, 'English', '8x5 inches', '1134567890134', '978-0-316-15331-0', '3', 'flower.png', false, 3);
INSERT INTO public.book VALUES (28, 'The Pirate King', 'A swashbuckling adventure set on the high seas.', 21.50, 'Jack Hawk', 330, 2021, 'English', '8x5 inches', '1334567890136', '978-0-316-15333-4', '2', 'horse.png', false, 3);
INSERT INTO public.book VALUES (29, 'The Fallen Star', 'A sci-fi novel about intergalactic warfare.', 24.99, 'Zara Nova', 400, 2023, 'English', '9x6 inches', '1434567890137', '978-0-316-15334-1', '3', 'flower.png', false, 4);


--
-- TOC entry 5064 (class 0 OID 16854)
-- Dependencies: 252
-- Data for Name: book_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.book_genres VALUES (1, 1);
INSERT INTO public.book_genres VALUES (1, 5);
INSERT INTO public.book_genres VALUES (2, 3);
INSERT INTO public.book_genres VALUES (2, 7);
INSERT INTO public.book_genres VALUES (3, 4);
INSERT INTO public.book_genres VALUES (3, 1);
INSERT INTO public.book_genres VALUES (3, 7);
INSERT INTO public.book_genres VALUES (4, 6);
INSERT INTO public.book_genres VALUES (5, 5);
INSERT INTO public.book_genres VALUES (5, 1);
INSERT INTO public.book_genres VALUES (6, 8);
INSERT INTO public.book_genres VALUES (6, 2);
INSERT INTO public.book_genres VALUES (7, 10);
INSERT INTO public.book_genres VALUES (7, 2);
INSERT INTO public.book_genres VALUES (8, 9);
INSERT INTO public.book_genres VALUES (8, 2);
INSERT INTO public.book_genres VALUES (9, 7);
INSERT INTO public.book_genres VALUES (9, 3);
INSERT INTO public.book_genres VALUES (10, 4);
INSERT INTO public.book_genres VALUES (10, 1);
INSERT INTO public.book_genres VALUES (11, 1);
INSERT INTO public.book_genres VALUES (12, 9);
INSERT INTO public.book_genres VALUES (13, 6);
INSERT INTO public.book_genres VALUES (13, 10);
INSERT INTO public.book_genres VALUES (14, 10);
INSERT INTO public.book_genres VALUES (15, 1);
INSERT INTO public.book_genres VALUES (15, 3);
INSERT INTO public.book_genres VALUES (16, 4);
INSERT INTO public.book_genres VALUES (16, 5);
INSERT INTO public.book_genres VALUES (17, 3);
INSERT INTO public.book_genres VALUES (17, 7);
INSERT INTO public.book_genres VALUES (18, 7);
INSERT INTO public.book_genres VALUES (18, 1);
INSERT INTO public.book_genres VALUES (19, 4);
INSERT INTO public.book_genres VALUES (19, 1);
INSERT INTO public.book_genres VALUES (20, 8);
INSERT INTO public.book_genres VALUES (20, 6);
INSERT INTO public.book_genres VALUES (21, 1);
INSERT INTO public.book_genres VALUES (21, 10);
INSERT INTO public.book_genres VALUES (22, 7);
INSERT INTO public.book_genres VALUES (22, 3);
INSERT INTO public.book_genres VALUES (23, 2);
INSERT INTO public.book_genres VALUES (23, 9);
INSERT INTO public.book_genres VALUES (24, 6);
INSERT INTO public.book_genres VALUES (24, 1);
INSERT INTO public.book_genres VALUES (25, 3);
INSERT INTO public.book_genres VALUES (25, 5);
INSERT INTO public.book_genres VALUES (26, 7);
INSERT INTO public.book_genres VALUES (26, 1);
INSERT INTO public.book_genres VALUES (27, 5);
INSERT INTO public.book_genres VALUES (27, 4);
INSERT INTO public.book_genres VALUES (28, 4);
INSERT INTO public.book_genres VALUES (28, 1);
INSERT INTO public.book_genres VALUES (29, 5);
INSERT INTO public.book_genres VALUES (29, 1);
INSERT INTO public.book_genres VALUES (30, 4);
INSERT INTO public.book_genres VALUES (30, 6);


--
-- TOC entry 5058 (class 0 OID 16821)
-- Dependencies: 246
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart_item VALUES (4, 2, 2, 3);


--
-- TOC entry 5048 (class 0 OID 16781)
-- Dependencies: 236
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comment VALUES (1, 'Great book! Highly recommend it.', '2023-11-01 10:00:00', 1, 1);
INSERT INTO public.comment VALUES (2, 'Loved the character development!', '2023-11-07 16:00:00', 3, 5);
INSERT INTO public.comment VALUES (3, 'Very boring, I couldn’t finish it.', '2023-11-10 19:00:00', 2, 12);
INSERT INTO public.comment VALUES (4, 'Disappointing ending, felt rushed.', '2023-11-14 23:00:00', 2, 18);
INSERT INTO public.comment VALUES (5, 'Couldn’t stop reading, truly captivating.', '2023-11-13 22:00:00', 1, 22);
INSERT INTO public.comment VALUES (6, 'An emotional rollercoaster, I loved it!', '2023-11-09 18:00:00', 1, 25);
INSERT INTO public.comment VALUES (7, 'The writing was great, but the plot was lacking.', '2023-11-16 01:00:00', 4, 30);
INSERT INTO public.comment VALUES (8, 'A beautiful and heartbreaking story.', '2023-11-15 00:00:00', 3, 34);
INSERT INTO public.comment VALUES (9, 'Too many plot holes, felt unfinished.', '2023-11-30 15:00:00', 2, 37);
INSERT INTO public.comment VALUES (10, 'The pacing was too slow for me.', '2023-11-22 07:00:00', 2, 42);
INSERT INTO public.comment VALUES (11, 'Loved every moment of it.', '2023-11-19 04:00:00', 1, 47);
INSERT INTO public.comment VALUES (12, 'The twists in the plot were brilliant.', '2023-12-01 16:00:00', 3, 50);
INSERT INTO public.comment VALUES (13, 'The plot was predictable, didn’t hold my interest.', '2023-12-06 21:00:00', 4, 52);
INSERT INTO public.comment VALUES (14, 'Amazing world-building, a must-read!', '2023-11-23 08:00:00', 1, 56);
INSERT INTO public.comment VALUES (15, 'Too many cliches, didn’t enjoy it much.', '2023-11-08 17:00:00', 4, 60);
INSERT INTO public.comment VALUES (16, 'Couldn’t relate to the main character.', '2023-11-28 13:00:00', 4, 65);
INSERT INTO public.comment VALUES (17, 'An unforgettable journey, highly recommend.', '2023-11-29 14:00:00', 1, 68);
INSERT INTO public.comment VALUES (18, 'Not worth the time, I regret reading it.', '2023-11-04 13:00:00', 2, 73);
INSERT INTO public.comment VALUES (19, 'Really enjoyed it, will read again.', '2023-11-29 20:00:00', 3, 76);
INSERT INTO public.comment VALUES (20, 'One of the best books I’ve read this year.', '2023-12-09 00:00:00', 1, 81);
INSERT INTO public.comment VALUES (21, 'The themes were really powerful.', '2023-11-25 10:00:00', 3, 85);
INSERT INTO public.comment VALUES (22, 'I can’t stop thinking about it, incredible!', '2023-12-05 20:00:00', 3, 89);
INSERT INTO public.comment VALUES (23, 'Wouldn’t recommend it, wasn’t for me.', '2023-12-04 19:00:00', 2, 92);
INSERT INTO public.comment VALUES (24, 'The pacing was too slow for me.', '2023-12-07 22:00:00', 2, 98);
INSERT INTO public.comment VALUES (25, 'Loved the setting, felt very immersive.', '2023-11-27 12:00:00', 3, 103);
INSERT INTO public.comment VALUES (26, 'Great book, but I didn’t enjoy the ending.', '2023-11-02 11:00:00', 1, 106);
INSERT INTO public.comment VALUES (27, 'A bit too much action, didn’t love it.', '2023-11-06 15:00:00', 2, 110);
INSERT INTO public.comment VALUES (28, 'Could have been better, some parts dragged on.', '2023-11-21 09:00:00', 4, 113);
INSERT INTO public.comment VALUES (29, 'The narrative was fresh and engaging.', '2023-11-26 11:00:00', 3, 116);


--
-- TOC entry 5050 (class 0 OID 16790)
-- Dependencies: 238
-- Data for Name: comment_like_dislike; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comment_like_dislike VALUES (1, 1, '2023-11-10 09:00:00', 1, 5);
INSERT INTO public.comment_like_dislike VALUES (2, -1, '2023-11-11 10:00:00', 2, 12);
INSERT INTO public.comment_like_dislike VALUES (3, 1, '2023-11-15 14:00:00', 3, 3);
INSERT INTO public.comment_like_dislike VALUES (4, 1, '2023-11-18 17:00:00', 4, 10);
INSERT INTO public.comment_like_dislike VALUES (5, -1, '2023-11-20 20:00:00', 1, 18);
INSERT INTO public.comment_like_dislike VALUES (6, 1, '2023-11-25 09:00:00', 2, 22);
INSERT INTO public.comment_like_dislike VALUES (7, -1, '2023-11-28 11:00:00', 3, 26);
INSERT INTO public.comment_like_dislike VALUES (9, -1, '2023-12-03 16:00:00', 2, 11);
INSERT INTO public.comment_like_dislike VALUES (11, 1, '2024-12-28 23:31:30.59', 4, 5);


--
-- TOC entry 5054 (class 0 OID 16804)
-- Dependencies: 242
-- Data for Name: coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.coupon VALUES (1, 10, '2023-12-01 00:00:00', '2028-12-01 00:00:00', false, 1);
INSERT INTO public.coupon VALUES (3, 10, '2023-12-01 00:00:00', '2028-12-01 00:00:00', false, 2);
INSERT INTO public.coupon VALUES (4, 15, '2023-12-01 00:00:00', '2028-12-01 00:00:00', false, 2);
INSERT INTO public.coupon VALUES (8, 15, '2024-12-14 00:48:44.481', '2028-12-12 03:00:00', false, 1);
INSERT INTO public.coupon VALUES (9, 10, '2023-12-01 00:00:00', '2028-12-01 00:00:00', true, 7);
INSERT INTO public.coupon VALUES (2, 15, '2023-12-01 00:00:00', '2028-12-01 00:00:00', true, 1);


--
-- TOC entry 5036 (class 0 OID 16734)
-- Dependencies: 224
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.customer_address VALUES (1, '123 Main St, Springfield, IL', true, '2023-01-01 00:00:00', NULL, 1);
INSERT INTO public.customer_address VALUES (2, '789 Birch St, Springfield, IL', false, '2022-06-01 00:00:00', '2022-12-31 23:59:59', 1);
INSERT INTO public.customer_address VALUES (3, '456 Oak Rd, Riverdale, NY', true, '2023-02-01 00:00:00', NULL, 2);
INSERT INTO public.customer_address VALUES (4, '789 Pine Ave, Los Angeles, CA', true, '2023-03-01 00:00:00', NULL, 3);
INSERT INTO public.customer_address VALUES (5, '101 Maple Ln, Chicago, IL', true, '2023-04-01 00:00:00', NULL, 4);
INSERT INTO public.customer_address VALUES (6, 'banana street', false, '2024-12-20 19:42:38.745', '2024-12-20 19:42:55.132', 7);
INSERT INTO public.customer_address VALUES (7, 'banana street, 123', false, '2024-12-20 19:42:55.145', '2024-12-20 22:56:03.547', 7);
INSERT INTO public.customer_address VALUES (8, 'Banana Street, Minion Building', true, '2024-12-20 22:56:03.565', NULL, 7);
INSERT INTO public.customer_address VALUES (9, 'Banana Street, Minion Building', true, '2024-12-20 22:56:03.565', NULL, 8);


--
-- TOC entry 5052 (class 0 OID 16797)
-- Dependencies: 240
-- Data for Name: discount; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.discount VALUES (2, 15, '2022-05-01 00:00:00', '2022-10-31 00:00:00', 7);
INSERT INTO public.discount VALUES (4, 25, '2023-06-01 00:00:00', '2026-06-01 00:00:00', 12);
INSERT INTO public.discount VALUES (5, 30, '2023-11-01 00:00:00', '2026-11-01 00:00:00', 15);
INSERT INTO public.discount VALUES (1, 10, '2022-01-01 00:00:00', '2026-01-01 00:00:00', 3);
INSERT INTO public.discount VALUES (3, 20, '2023-01-01 00:00:00', '2022-12-31 00:00:00', 10);
INSERT INTO public.discount VALUES (9, 15, '2029-12-11 00:00:00', '2030-12-13 00:00:00', 1);
INSERT INTO public.discount VALUES (15, 15, '2030-12-14 03:00:00', '2031-12-14 03:00:00', 1);
INSERT INTO public.discount VALUES (16, 99, '2025-01-02 18:20:24.591', '2025-01-02 18:25:00', 4);


--
-- TOC entry 5038 (class 0 OID 16744)
-- Dependencies: 226
-- Data for Name: friend_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.friend_request VALUES (1, '2023-01-10 00:00:00', '2023-01-12 00:00:00', 1, 2);
INSERT INTO public.friend_request VALUES (2, '2023-02-15 00:00:00', '2023-02-18 00:00:00', 1, 3);
INSERT INTO public.friend_request VALUES (3, '2023-03-20 00:00:00', '2023-03-22 00:00:00', 2, 4);
INSERT INTO public.friend_request VALUES (4, '2023-04-25 00:00:00', '2023-04-28 00:00:00', 3, 5);
INSERT INTO public.friend_request VALUES (5, '2023-05-30 00:00:00', '2023-06-02 00:00:00', 4, 6);
INSERT INTO public.friend_request VALUES (6, '2023-06-15 00:00:00', '2023-06-18 00:00:00', 5, 6);
INSERT INTO public.friend_request VALUES (7, '2025-01-02 18:12:48.236', '2025-01-02 18:13:22.76', 7, 1);


--
-- TOC entry 5030 (class 0 OID 16705)
-- Dependencies: 218
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.genre VALUES (1, 'Fiction');
INSERT INTO public.genre VALUES (2, 'Non-Fiction');
INSERT INTO public.genre VALUES (3, 'Mystery');
INSERT INTO public.genre VALUES (4, 'Fantasy');
INSERT INTO public.genre VALUES (5, 'Science Fiction');
INSERT INTO public.genre VALUES (6, 'Romance');
INSERT INTO public.genre VALUES (7, 'Thriller');
INSERT INTO public.genre VALUES (8, 'Historical Fiction');
INSERT INTO public.genre VALUES (9, 'Biography');
INSERT INTO public.genre VALUES (10, 'Self-Help');


--
-- TOC entry 5060 (class 0 OID 16828)
-- Dependencies: 248
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."order" VALUES (1, '2024-12-24 00:32:55.808', 39.99, 7, 8, NULL);
INSERT INTO public."order" VALUES (2, '2024-12-24 00:42:50.965', 39.99, 7, 8, NULL);
INSERT INTO public."order" VALUES (3, '2024-12-24 00:50:28.651', 62.48, 7, 8, NULL);
INSERT INTO public."order" VALUES (4, '2024-12-26 16:41:05', 83.2, 7, 8, 9);
INSERT INTO public."order" VALUES (5, '2024-12-29 23:48:55.269', 21.99, 8, 9, NULL);
INSERT INTO public."order" VALUES (6, '2024-12-29 23:53:29.379', 55.5, 8, 9, NULL);
INSERT INTO public."order" VALUES (7, '2024-12-29 23:55:08.454', 64.97, 8, 9, NULL);
INSERT INTO public."order" VALUES (8, '2024-12-29 23:56:45.463', 62.99, 8, 9, NULL);
INSERT INTO public."order" VALUES (9, '2024-12-30 00:03:48.484', 67.97, 8, 9, NULL);
INSERT INTO public."order" VALUES (10, '2025-01-02 18:09:44.476', 73.07, 1, 1, 2);


--
-- TOC entry 5062 (class 0 OID 16839)
-- Dependencies: 250
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_item VALUES (1, 1, 24.99, 1, 3, 1);
INSERT INTO public.order_item VALUES (2, 1, 17.50, 1, 26, NULL);
INSERT INTO public.order_item VALUES (3, 1, 24.99, 2, 3, 1);
INSERT INTO public.order_item VALUES (4, 1, 17.50, 2, 26, NULL);
INSERT INTO public.order_item VALUES (5, 2, 24.99, 3, 3, 1);
INSERT INTO public.order_item VALUES (6, 1, 17.50, 3, 26, NULL);
INSERT INTO public.order_item VALUES (7, 1, 24.99, 4, 3, 1);
INSERT INTO public.order_item VALUES (8, 2, 19.99, 4, 1, NULL);
INSERT INTO public.order_item VALUES (9, 2, 14.99, 4, 2, NULL);
INSERT INTO public.order_item VALUES (10, 1, 21.99, 5, 19, NULL);
INSERT INTO public.order_item VALUES (11, 2, 18.50, 6, 21, NULL);
INSERT INTO public.order_item VALUES (12, 1, 18.50, 6, 5, NULL);
INSERT INTO public.order_item VALUES (13, 2, 19.99, 7, 1, NULL);
INSERT INTO public.order_item VALUES (14, 1, 24.99, 7, 29, NULL);
INSERT INTO public.order_item VALUES (15, 2, 20.00, 8, 8, NULL);
INSERT INTO public.order_item VALUES (16, 1, 22.99, 8, 16, NULL);
INSERT INTO public.order_item VALUES (17, 2, 23.99, 9, 27, NULL);
INSERT INTO public.order_item VALUES (18, 1, 19.99, 9, 1, NULL);
INSERT INTO public.order_item VALUES (19, 1, 14.99, 10, 2, NULL);
INSERT INTO public.order_item VALUES (20, 2, 24.99, 10, 3, 1);
INSERT INTO public.order_item VALUES (21, 1, 26.00, 10, 30, NULL);


--
-- TOC entry 5040 (class 0 OID 16751)
-- Dependencies: 228
-- Data for Name: read_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.read_status VALUES (1, 'Will read', '2023-11-01 00:00:00', 1, 3);
INSERT INTO public.read_status VALUES (2, 'Already Read', '2023-11-10 00:00:00', 1, 5);
INSERT INTO public.read_status VALUES (3, 'Reading', '2023-11-12 00:00:00', 1, 7);
INSERT INTO public.read_status VALUES (4, 'Will read', '2023-11-15 00:00:00', 1, 10);
INSERT INTO public.read_status VALUES (5, 'Already Read', '2023-11-20 00:00:00', 1, 15);
INSERT INTO public.read_status VALUES (6, 'Reading', '2023-11-05 00:00:00', 2, 12);
INSERT INTO public.read_status VALUES (7, 'Will read', '2023-11-11 00:00:00', 2, 18);
INSERT INTO public.read_status VALUES (8, 'Already Read', '2023-11-18 00:00:00', 2, 22);
INSERT INTO public.read_status VALUES (9, 'Reading', '2023-11-25 00:00:00', 2, 25);
INSERT INTO public.read_status VALUES (10, 'Will read', '2023-11-30 00:00:00', 2, 30);
INSERT INTO public.read_status VALUES (17, 'Already Read', '2024-12-29 19:13:39.718', 4, 1);
INSERT INTO public.read_status VALUES (19, 'Will Read', '2024-12-31 18:21:02.516', 7, 1);
INSERT INTO public.read_status VALUES (20, 'Will Read', '2025-01-02 18:35:32.924', 1, 21);


--
-- TOC entry 5044 (class 0 OID 16765)
-- Dependencies: 232
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.review VALUES (1, 8, 'A thrilling journey with great character development!', '2023-04-10 00:00:00', 1, 1);
INSERT INTO public.review VALUES (2, 7, 'Good story but could use more depth.', '2023-04-11 00:00:00', 2, 1);
INSERT INTO public.review VALUES (3, 9, 'An exciting and unpredictable read!', '2023-04-12 00:00:00', 3, 1);
INSERT INTO public.review VALUES (4, 3, 'The plot was very predictable and the pacing was slow.', '2023-04-13 00:00:00', 4, 1);
INSERT INTO public.review VALUES (5, 9, 'A captivating thriller from start to finish!', '2023-05-15 00:00:00', 2, 2);
INSERT INTO public.review VALUES (6, 8, 'Great suspense, but the ending was a bit predictable.', '2023-05-16 00:00:00', 3, 2);
INSERT INTO public.review VALUES (7, 4, 'It dragged on too much and felt like a chore to finish.', '2023-05-17 00:00:00', 4, 2);
INSERT INTO public.review VALUES (8, 7, 'I enjoyed the story, but the characters lacked depth.', '2023-05-18 00:00:00', 5, 2);
INSERT INTO public.review VALUES (9, 7, 'Fun adventure but felt rushed in parts.', '2023-06-10 00:00:00', 1, 3);
INSERT INTO public.review VALUES (10, 9, 'Amazing world-building and a captivating plot!', '2023-06-11 00:00:00', 2, 3);
INSERT INTO public.review VALUES (11, 8, 'The adventure was great, but the ending left me wanting more.', '2023-06-12 00:00:00', 3, 3);
INSERT INTO public.review VALUES (12, 4, 'It didn’t live up to the hype, felt like a generic adventure story.', '2023-06-13 00:00:00', 4, 3);
INSERT INTO public.review VALUES (13, 10, 'An enchanting read, loved every moment of it!', '2023-07-10 00:00:00', 2, 4);
INSERT INTO public.review VALUES (14, 9, 'Well-written with a touch of mystery, definitely recommend!', '2023-07-11 00:00:00', 3, 4);
INSERT INTO public.review VALUES (15, 5, 'The plot was too predictable and didn’t feel very magical.', '2023-07-12 00:00:00', 4, 4);
INSERT INTO public.review VALUES (16, 7, 'Enjoyed it, but it was missing something to make it truly magical.', '2023-07-13 00:00:00', 5, 4);
INSERT INTO public.review VALUES (17, 8, 'Great action-packed story with solid characters.', '2023-08-10 00:00:00', 1, 5);
INSERT INTO public.review VALUES (18, 7, 'Action scenes were fantastic, but the story felt a bit repetitive.', '2023-08-11 00:00:00', 2, 5);
INSERT INTO public.review VALUES (19, 9, 'A fantastic book for action lovers, highly recommend!', '2023-08-12 00:00:00', 3, 5);
INSERT INTO public.review VALUES (20, 4, 'The action was fun, but the plot was boring and predictable.', '2023-08-13 00:00:00', 4, 5);
INSERT INTO public.review VALUES (21, 8, 'A quiet, introspective read with beautiful writing.', '2023-09-01 00:00:00', 3, 6);
INSERT INTO public.review VALUES (22, 9, 'A stunning novel about personal growth and change.', '2023-09-02 00:00:00', 4, 6);
INSERT INTO public.review VALUES (23, 3, 'I found it very boring and struggled to stay interested.', '2023-09-03 00:00:00', 5, 6);
INSERT INTO public.review VALUES (24, 10, 'Absolutely loved it. The narrative was beautifully crafted!', '2023-09-04 00:00:00', 1, 6);
INSERT INTO public.review VALUES (25, 6, 'Interesting take on romance, but not enough depth for me.', '2023-10-05 00:00:00', 2, 7);
INSERT INTO public.review VALUES (26, 8, 'A beautiful blend of love and tragedy. Well-written.', '2023-10-06 00:00:00', 3, 7);
INSERT INTO public.review VALUES (27, 7, 'Good romance, but the war aspect could have been explored more.', '2023-10-07 00:00:00', 4, 7);
INSERT INTO public.review VALUES (28, 2, 'The story was clichéd and the characters didn’t resonate with me.', '2023-10-08 00:00:00', 5, 7);
INSERT INTO public.review VALUES (29, 8, 'An inspiring story of self-discovery and transformation.', '2023-11-10 00:00:00', 1, 8);
INSERT INTO public.review VALUES (30, 9, 'The journey was beautiful and moving, made me reflect on my own life.', '2023-11-11 00:00:00', 2, 8);
INSERT INTO public.review VALUES (31, 4, 'The book was overly philosophical and dragged on too long.', '2023-11-12 00:00:00', 3, 8);
INSERT INTO public.review VALUES (32, 10, 'A thought-provoking book, deeply moving.', '2023-11-13 00:00:00', 4, 8);
INSERT INTO public.review VALUES (33, 9, 'A great sci-fi novel with twists and turns!', '2023-12-01 00:00:00', 3, 9);
INSERT INTO public.review VALUES (34, 8, 'Exciting from start to finish, but the pacing slowed in the middle.', '2023-12-02 00:00:00', 4, 9);
INSERT INTO public.review VALUES (35, 7, 'Good concept, but the execution wasn’t as great as expected.', '2023-12-03 00:00:00', 5, 9);
INSERT INTO public.review VALUES (36, 3, 'It felt very confusing and hard to follow.', '2023-12-04 00:00:00', 1, 9);
INSERT INTO public.review VALUES (37, 8, 'A solid fantasy novel, though it wasn’t as gripping as I hoped.', '2023-12-10 00:00:00', 2, 10);
INSERT INTO public.review VALUES (38, 9, 'Fantastic characters and world-building. A great read!', '2023-12-11 00:00:00', 3, 10);
INSERT INTO public.review VALUES (39, 7, 'Enjoyed it, but it didn’t stand out among other fantasy books.', '2023-12-12 00:00:00', 4, 10);
INSERT INTO public.review VALUES (40, 5, 'It was okay, but I expected more from a fantasy novel.', '2023-12-13 00:00:00', 5, 10);
INSERT INTO public.review VALUES (41, 8, 'A fascinating historical novel that kept me hooked!', '2023-12-15 00:00:00', 1, 11);
INSERT INTO public.review VALUES (42, 7, 'Interesting concept but lacked emotional depth.', '2023-12-16 00:00:00', 2, 11);
INSERT INTO public.review VALUES (43, 9, 'One of the best historical novels I’ve read in a while.', '2023-12-17 00:00:00', 3, 11);
INSERT INTO public.review VALUES (44, 5, 'It was okay, but I didn’t connect with the characters.', '2023-12-18 00:00:00', 4, 11);
INSERT INTO public.review VALUES (45, 6, 'A decent read, though it didn’t live up to my expectations.', '2023-12-19 00:00:00', 1, 12);
INSERT INTO public.review VALUES (46, 9, 'I loved the mysteries and the twists throughout the story!', '2023-12-20 00:00:00', 2, 12);
INSERT INTO public.review VALUES (47, 7, 'The story was good, but it lacked strong character development.', '2023-12-21 00:00:00', 3, 12);
INSERT INTO public.review VALUES (48, 3, 'The pacing was slow, and I didn’t care for the ending.', '2023-12-22 00:00:00', 4, 12);
INSERT INTO public.review VALUES (49, 8, 'A captivating fantasy adventure, well worth the read!', '2023-12-23 00:00:00', 1, 13);
INSERT INTO public.review VALUES (50, 9, 'Loved the magic and adventure, great plot twists!', '2023-12-24 00:00:00', 2, 13);
INSERT INTO public.review VALUES (51, 6, 'It was good, but the story dragged at times.', '2023-12-25 00:00:00', 3, 13);
INSERT INTO public.review VALUES (52, 4, 'Felt too generic and predictable for a fantasy novel.', '2023-12-26 00:00:00', 4, 13);
INSERT INTO public.review VALUES (53, 7, 'A decent maritime adventure, but it could have been more thrilling.', '2023-12-27 00:00:00', 1, 14);
INSERT INTO public.review VALUES (54, 9, 'Beautifully written with great attention to detail!', '2023-12-28 00:00:00', 2, 14);
INSERT INTO public.review VALUES (55, 5, 'It was okay, but I didn’t find it particularly engaging.', '2023-12-29 00:00:00', 3, 14);
INSERT INTO public.review VALUES (56, 6, 'The pacing was slow, and the story felt repetitive at times.', '2023-12-30 00:00:00', 4, 14);
INSERT INTO public.review VALUES (57, 8, 'A thrilling action-packed novel, I couldn’t put it down!', '2024-01-01 00:00:00', 1, 15);
INSERT INTO public.review VALUES (58, 9, 'Great plot with a lot of suspense and unexpected twists!', '2024-01-02 00:00:00', 2, 15);
INSERT INTO public.review VALUES (59, 7, 'The story was good, but the characters could have been more developed.', '2024-01-03 00:00:00', 3, 15);
INSERT INTO public.review VALUES (60, 3, 'I couldn’t get into it, the plot was too confusing.', '2024-01-04 00:00:00', 4, 15);
INSERT INTO public.review VALUES (61, 8, 'A brilliant historical fiction novel, highly recommended!', '2024-01-05 00:00:00', 1, 16);
INSERT INTO public.review VALUES (62, 7, 'A good read, but some parts felt a bit predictable.', '2024-01-06 00:00:00', 2, 16);
INSERT INTO public.review VALUES (63, 9, 'Engaging from start to finish, loved the characters!', '2024-01-07 00:00:00', 3, 16);
INSERT INTO public.review VALUES (64, 6, 'It was an okay story, but nothing special.', '2024-01-08 00:00:00', 4, 16);
INSERT INTO public.review VALUES (65, 7, 'Interesting psychological thriller, but it felt too slow at times.', '2024-01-09 00:00:00', 1, 17);
INSERT INTO public.review VALUES (66, 8, 'A great mystery with unexpected twists!', '2024-01-10 00:00:00', 2, 17);
INSERT INTO public.review VALUES (67, 6, 'Good concept, but it could have been executed better.', '2024-01-11 00:00:00', 3, 17);
INSERT INTO public.review VALUES (68, 4, 'I found it too predictable, didn’t really enjoy it.', '2024-01-12 00:00:00', 4, 17);
INSERT INTO public.review VALUES (69, 9, 'A deep, thought-provoking book with complex characters.', '2024-01-13 00:00:00', 1, 18);
INSERT INTO public.review VALUES (70, 7, 'A solid read, but the pacing was a little slow.', '2024-01-14 00:00:00', 2, 18);
INSERT INTO public.review VALUES (71, 8, 'Great storytelling, but I expected more from the ending.', '2024-01-15 00:00:00', 3, 18);
INSERT INTO public.review VALUES (72, 3, 'I struggled to finish it. The story felt too bleak and depressing.', '2024-01-16 00:00:00', 4, 18);
INSERT INTO public.review VALUES (73, 10, 'An epic adventure with fantastic world-building and memorable characters.', '2024-01-17 00:00:00', 1, 19);
INSERT INTO public.review VALUES (74, 9, 'Loved every minute of this heroic fantasy story!', '2024-01-18 00:00:00', 2, 19);
INSERT INTO public.review VALUES (75, 7, 'It was good, but the pacing was a bit inconsistent.', '2024-01-19 00:00:00', 3, 19);
INSERT INTO public.review VALUES (76, 5, 'Too predictable and lacking depth in some areas.', '2024-01-20 00:00:00', 4, 19);
INSERT INTO public.review VALUES (77, 8, 'A great suspense-filled thriller, kept me guessing!', '2024-01-21 00:00:00', 1, 20);
INSERT INTO public.review VALUES (78, 6, 'Decent plot, but the pacing was too slow for my liking.', '2024-01-22 00:00:00', 2, 20);
INSERT INTO public.review VALUES (79, 7, 'The plot was good, but the characters felt underdeveloped.', '2024-01-23 00:00:00', 3, 20);
INSERT INTO public.review VALUES (80, 4, 'The ending was a letdown and left too many unanswered questions.', '2024-01-24 00:00:00', 4, 20);
INSERT INTO public.review VALUES (81, 8, 'A gripping tale of betrayal and power struggles.', '2024-01-25 00:00:00', 1, 21);
INSERT INTO public.review VALUES (82, 7, 'Well-written but the story dragged in the middle.', '2024-01-26 00:00:00', 2, 21);
INSERT INTO public.review VALUES (83, 9, 'An exciting historical novel, loved the action and intrigue!', '2024-01-27 00:00:00', 3, 21);
INSERT INTO public.review VALUES (84, 6, 'It was good, but some parts were hard to follow.', '2024-01-28 00:00:00', 4, 21);
INSERT INTO public.review VALUES (85, 10, 'A fascinating look at time travel with great character development.', '2024-01-29 00:00:00', 1, 22);
INSERT INTO public.review VALUES (86, 8, 'Enjoyable time travel story with great twists!', '2024-01-30 00:00:00', 2, 22);
INSERT INTO public.review VALUES (87, 7, 'Interesting concept, but the execution felt rushed at times.', '2024-01-31 00:00:00', 3, 22);
INSERT INTO public.review VALUES (88, 4, 'I didn’t enjoy it. The plot was too confusing and hard to follow.', '2024-02-01 00:00:00', 4, 22);
INSERT INTO public.review VALUES (89, 8, 'A mind-bending sci-fi adventure with great depth!', '2024-02-02 00:00:00', 1, 23);
INSERT INTO public.review VALUES (90, 9, 'I loved the exploration of space and time. A must-read for sci-fi fans!', '2024-02-03 00:00:00', 2, 23);
INSERT INTO public.review VALUES (91, 7, 'The story was good, but I expected more action.', '2024-02-04 00:00:00', 3, 23);
INSERT INTO public.review VALUES (92, 5, 'It was too complex and I had a hard time keeping up with the plot.', '2024-02-05 00:00:00', 4, 23);
INSERT INTO public.review VALUES (93, 8, 'A well-crafted story about redemption and second chances.', '2024-02-06 00:00:00', 1, 24);
INSERT INTO public.review VALUES (94, 6, 'Good, but some parts felt a bit cliché.', '2024-02-07 00:00:00', 2, 24);
INSERT INTO public.review VALUES (95, 7, 'An emotional story, but the ending felt too rushed.', '2024-02-08 00:00:00', 3, 24);
INSERT INTO public.review VALUES (96, 4, 'The plot was a bit predictable, didn’t hold my attention.', '2024-02-09 00:00:00', 4, 24);
INSERT INTO public.review VALUES (97, 9, 'A thrilling and adventurous fantasy novel, loved it!', '2024-02-10 00:00:00', 1, 25);
INSERT INTO public.review VALUES (98, 8, 'Great world-building and action sequences!', '2024-02-11 00:00:00', 2, 25);
INSERT INTO public.review VALUES (99, 7, 'It was good, but the pacing could have been better.', '2024-02-12 00:00:00', 3, 25);
INSERT INTO public.review VALUES (100, 5, 'The story was a bit predictable, not very original.', '2024-02-13 00:00:00', 4, 25);
INSERT INTO public.review VALUES (101, 10, 'A beautifully written, poetic story about love and loss.', '2024-02-14 00:00:00', 1, 26);
INSERT INTO public.review VALUES (102, 8, 'Touching and well-crafted, though a bit slow at times.', '2024-02-15 00:00:00', 2, 26);
INSERT INTO public.review VALUES (103, 6, 'A solid romance, but I didn’t connect with the characters as much.', '2024-02-16 00:00:00', 3, 26);
INSERT INTO public.review VALUES (104, 3, 'It was too slow and lacked excitement.', '2024-02-17 00:00:00', 4, 26);
INSERT INTO public.review VALUES (105, 9, 'A captivating story about ambition and success, loved it!', '2024-02-18 00:00:00', 1, 27);
INSERT INTO public.review VALUES (106, 7, 'Good read, but it could have been more original.', '2024-02-19 00:00:00', 2, 27);
INSERT INTO public.review VALUES (107, 6, 'The plot was decent, but it didn’t leave a lasting impact.', '2024-02-20 00:00:00', 3, 27);
INSERT INTO public.review VALUES (108, 4, 'Not a fan. It felt too predictable and cliché.', '2024-02-21 00:00:00', 4, 27);
INSERT INTO public.review VALUES (109, 8, 'A great historical fiction with strong characters and plot!', '2024-02-22 00:00:00', 1, 28);
INSERT INTO public.review VALUES (110, 7, 'Good story, but some moments were too drawn out.', '2024-02-23 00:00:00', 2, 28);
INSERT INTO public.review VALUES (111, 9, 'A truly engaging read, one of my favorites this year!', '2024-02-24 00:00:00', 3, 28);
INSERT INTO public.review VALUES (112, 5, 'It was just okay, not as exciting as I expected.', '2024-02-25 00:00:00', 4, 28);
INSERT INTO public.review VALUES (113, 8, 'A moving, emotional novel about loss and healing.', '2024-02-26 00:00:00', 1, 29);
INSERT INTO public.review VALUES (114, 6, 'Good story, but it felt a bit predictable towards the end.', '2024-02-27 00:00:00', 2, 29);
INSERT INTO public.review VALUES (115, 7, 'I enjoyed it, but the plot could have been deeper.', '2024-02-28 00:00:00', 3, 29);
INSERT INTO public.review VALUES (116, 3, 'I didn’t enjoy it. The pacing was slow and the plot didn’t grab me.', '2024-02-29 00:00:00', 4, 29);
INSERT INTO public.review VALUES (118, 8, 'A great read, filled with action and memorable characters.', '2024-03-02 00:00:00', 2, 30);
INSERT INTO public.review VALUES (119, 6, 'It was good, but the pacing slowed down in the middle.', '2024-03-03 00:00:00', 3, 30);


--
-- TOC entry 5046 (class 0 OID 16774)
-- Dependencies: 234
-- Data for Name: review_like_dislike; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.review_like_dislike VALUES (1, 1, '2023-11-20 00:00:00', 2, 1);
INSERT INTO public.review_like_dislike VALUES (2, -1, '2023-11-21 00:00:00', 3, 2);
INSERT INTO public.review_like_dislike VALUES (3, 1, '2023-12-02 00:00:00', 4, 9);
INSERT INTO public.review_like_dislike VALUES (5, 1, '2023-12-12 00:00:00', 2, 19);
INSERT INTO public.review_like_dislike VALUES (6, -1, '2023-12-13 00:00:00', 3, 20);
INSERT INTO public.review_like_dislike VALUES (7, 1, '2024-01-03 00:00:00', 4, 25);
INSERT INTO public.review_like_dislike VALUES (8, -1, '2024-01-04 00:00:00', 1, 26);
INSERT INTO public.review_like_dislike VALUES (9, 1, '2024-01-12 00:00:00', 2, 33);
INSERT INTO public.review_like_dislike VALUES (10, -1, '2024-01-13 00:00:00', 3, 34);
INSERT INTO public.review_like_dislike VALUES (11, 1, '2023-11-25 00:00:00', 4, 3);
INSERT INTO public.review_like_dislike VALUES (12, -1, '2023-11-26 00:00:00', 1, 4);
INSERT INTO public.review_like_dislike VALUES (13, 1, '2023-12-05 00:00:00', 2, 7);
INSERT INTO public.review_like_dislike VALUES (14, -1, '2023-12-06 00:00:00', 3, 8);
INSERT INTO public.review_like_dislike VALUES (15, 1, '2023-12-08 00:00:00', 4, 13);
INSERT INTO public.review_like_dislike VALUES (16, -1, '2023-12-09 00:00:00', 1, 14);
INSERT INTO public.review_like_dislike VALUES (17, 1, '2023-12-14 00:00:00', 2, 19);
INSERT INTO public.review_like_dislike VALUES (18, -1, '2023-12-15 00:00:00', 3, 20);
INSERT INTO public.review_like_dislike VALUES (19, 1, '2023-12-18 00:00:00', 4, 25);
INSERT INTO public.review_like_dislike VALUES (20, -1, '2023-12-19 00:00:00', 1, 26);
INSERT INTO public.review_like_dislike VALUES (21, 1, '2023-12-22 00:00:00', 2, 27);
INSERT INTO public.review_like_dislike VALUES (22, -1, '2023-12-23 00:00:00', 3, 28);
INSERT INTO public.review_like_dislike VALUES (23, 1, '2023-12-28 00:00:00', 4, 33);
INSERT INTO public.review_like_dislike VALUES (24, -1, '2023-12-29 00:00:00', 1, 34);
INSERT INTO public.review_like_dislike VALUES (4, 1, '2023-12-03 00:00:00', 1, 10);


--
-- TOC entry 5056 (class 0 OID 16812)
-- Dependencies: 244
-- Data for Name: shopping_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shopping_cart VALUES (1, 1);
INSERT INTO public.shopping_cart VALUES (2, 2);
INSERT INTO public.shopping_cart VALUES (3, 3);
INSERT INTO public.shopping_cart VALUES (4, 4);
INSERT INTO public.shopping_cart VALUES (5, 5);
INSERT INTO public.shopping_cart VALUES (6, 6);
INSERT INTO public.shopping_cart VALUES (7, 7);
INSERT INTO public.shopping_cart VALUES (8, 8);
INSERT INTO public.shopping_cart VALUES (9, 9);


--
-- TOC entry 5032 (class 0 OID 16714)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" VALUES (2, '7aMoSunupXV412c3JNDOY7yTNk43', 'Jane Smith', 'jane.smith@example.com', 'user1.png', 1000.00, 'description: Customer', false, 'user');
INSERT INTO public."user" VALUES (9, 'kzlHp4KfbaRLYwmBc3c4wftz5Wn2', 'Matay Aydın', 'donemselvegan@example.com', '"user2.png"', 0.00, 'YETERRRRRRRRRRRRRRr
', false, 'user');
INSERT INTO public."user" VALUES (7, 'UirMdmsV3eXTt9S5eIDoVcId5YP2', 'Giray Banana Yıldırım', 'yildirimbananagiray@gmail.com', 'user2.png', 216.80, 'Banana Banana Banana', false, 'user');
INSERT INTO public."user" VALUES (8, 'D6jaOwLOEYPd0QoZyfhvXEMbY303', 'Meto', 'soyalpmetin3444@hotmail.com', 'user3.png', 726.58, 'Kill me', false, 'user');
INSERT INTO public."user" VALUES (5, 'M8ZvkaZKMjOpRgaN4evGnrf7XAh2', 'Charlie Adams', 'charlie.adams@example.com', 'user4.png', 1000.00, 'description: Admin', false, 'user');
INSERT INTO public."user" VALUES (6, 'cvVlKdwv7HY97bOr6aevPP0dpPF2', 'Dana White', 'dana.white@example.com', 'user5.png', 1000.00, 'description: Admin', false, 'user');
INSERT INTO public."user" VALUES (4, 'fgxYhFZScufIA5jzyInPsnF7eQy2', 'Bob Brown', 'bob.brown@example.com', 'user6.png', 1275.41, 'description: Publisher', false, 'user');
INSERT INTO public."user" VALUES (3, 'V1UrO2Pr4aU5uWiHXJ3BmFrXHVC3', 'Alice Johnson', 'alice.johnson@example.com', 'user7.png', 1188.03, 'description: Publisher', false, 'user');
INSERT INTO public."user" VALUES (1, 'MhndGcq5KXYYYHROtH01EPhh3rj2', 'John Doe', 'john.doe@example.com', 'user8.png', 1026.93, 'description: Customer', false, 'user');


--
-- TOC entry 5063 (class 0 OID 16847)
-- Dependencies: 251
-- Data for Name: user_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_genres VALUES (1, 1);
INSERT INTO public.user_genres VALUES (1, 3);
INSERT INTO public.user_genres VALUES (1, 5);
INSERT INTO public.user_genres VALUES (2, 2);
INSERT INTO public.user_genres VALUES (2, 4);
INSERT INTO public.user_genres VALUES (2, 6);
INSERT INTO public.user_genres VALUES (3, 1);
INSERT INTO public.user_genres VALUES (3, 4);
INSERT INTO public.user_genres VALUES (3, 7);
INSERT INTO public.user_genres VALUES (4, 3);
INSERT INTO public.user_genres VALUES (4, 5);
INSERT INTO public.user_genres VALUES (4, 8);
INSERT INTO public.user_genres VALUES (5, 2);
INSERT INTO public.user_genres VALUES (5, 6);
INSERT INTO public.user_genres VALUES (5, 9);
INSERT INTO public.user_genres VALUES (6, 1);
INSERT INTO public.user_genres VALUES (6, 7);
INSERT INTO public.user_genres VALUES (6, 10);
INSERT INTO public.user_genres VALUES (8, 5);
INSERT INTO public.user_genres VALUES (7, 10);
INSERT INTO public.user_genres VALUES (7, 8);
INSERT INTO public.user_genres VALUES (9, 1);
INSERT INTO public.user_genres VALUES (9, 7);


--
-- TOC entry 5042 (class 0 OID 16758)
-- Dependencies: 230
-- Data for Name: wish_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.wish_list VALUES (2, '2023-11-05 00:00:00', 1, 6);
INSERT INTO public.wish_list VALUES (3, '2023-11-10 00:00:00', 1, 12);
INSERT INTO public.wish_list VALUES (5, '2023-11-07 00:00:00', 2, 28);
INSERT INTO public.wish_list VALUES (6, '2023-11-11 00:00:00', 2, 30);
INSERT INTO public.wish_list VALUES (4, '2023-11-02 00:00:00', 2, 15);
INSERT INTO public.wish_list VALUES (7, '2025-01-02 18:09:03.933', 1, 3);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 221
-- Name: book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_id_seq', 30, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 245
-- Name: cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_item_id_seq', 34, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 235
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 34, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 237
-- Name: comment_like_dislike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_like_dislike_id_seq', 13, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 241
-- Name: coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupon_id_seq', 9, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 223
-- Name: customer_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_address_id_seq', 9, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 239
-- Name: discount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_id_seq', 16, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 225
-- Name: friend_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.friend_request_id_seq', 7, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 217
-- Name: genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genre_id_seq', 10, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_id_seq', 10, true);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 249
-- Name: order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_item_id_seq', 21, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 227
-- Name: read_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.read_status_id_seq', 20, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 231
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_id_seq', 120, true);


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 233
-- Name: review_like_dislike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_like_dislike_id_seq', 28, true);


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 243
-- Name: shopping_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_cart_id_seq', 9, true);


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 9, true);


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 229
-- Name: wish_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wish_list_id_seq', 7, true);


--
-- TOC entry 4806 (class 2606 OID 16710)
-- Name: genre PK_0285d4f1655d080cfcf7d1ab141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16788)
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16835)
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16756)
-- Name: read_status PK_17dfd8caf66a02d4787d7a21467; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.read_status
    ADD CONSTRAINT "PK_17dfd8caf66a02d4787d7a21467" PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16742)
-- Name: customer_address PK_23810fb397050d8ac37dae44ff6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT "PK_23810fb397050d8ac37dae44ff6" PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 16772)
-- Name: review PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 16779)
-- Name: review_like_dislike PK_3e210a025b974d709483cd717a5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_like_dislike
    ADD CONSTRAINT "PK_3e210a025b974d709483cd717a5" PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16817)
-- Name: shopping_cart PK_40f9358cdf55d73d8a2ad226592; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT "PK_40f9358cdf55d73d8a2ad226592" PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 16749)
-- Name: friend_request PK_4c9d23ff394888750cf66cac17c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_request
    ADD CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 16851)
-- Name: user_genres PK_79c0acb22f18e7f8048339f7b01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_genres
    ADD CONSTRAINT "PK_79c0acb22f18e7f8048339f7b01" PRIMARY KEY (user_id, genre_id);


--
-- TOC entry 4812 (class 2606 OID 16732)
-- Name: book PK_a3afef72ec8f80e6e5c310b28a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY (id);


--
-- TOC entry 4838 (class 2606 OID 16826)
-- Name: cart_item PK_bd94725aa84f8cf37632bcde997; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16722)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16846)
-- Name: order_item PK_d01158fe15b1ead5c26fd7f4e90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16802)
-- Name: discount PK_d05d8712e429673e459e7f1cddb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16858)
-- Name: book_genres PK_dc2d072b9d76acb4c5f2a4c55e6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT "PK_dc2d072b9d76acb4c5f2a4c55e6" PRIMARY KEY (book_id, genre_id);


--
-- TOC entry 4828 (class 2606 OID 16795)
-- Name: comment_like_dislike PK_e2d116790b6899bf8dda74ac6dd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_like_dislike
    ADD CONSTRAINT "PK_e2d116790b6899bf8dda74ac6dd" PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 16763)
-- Name: wish_list PK_f8e27bbb59891db7cd9f920c272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish_list
    ADD CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16810)
-- Name: coupon PK_fcbe9d72b60eed35f46dc35a682; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16837)
-- Name: order UQ_1df473e977ba1d06a10b86813b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "UQ_1df473e977ba1d06a10b86813b3" UNIQUE (used_coupon_id);


--
-- TOC entry 4836 (class 2606 OID 16819)
-- Name: shopping_cart UQ_2486032b4fc81da82629c53f955; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT "UQ_2486032b4fc81da82629c53f955" UNIQUE (user_id);


--
-- TOC entry 4808 (class 2606 OID 16712)
-- Name: genre UQ_dd8cd9e50dd049656e4be1f7e8c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE (name);


--
-- TOC entry 4849 (class 1259 OID 16860)
-- Name: IDX_43ff7d87d7506e768ca6491a1d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_43ff7d87d7506e768ca6491a1d" ON public.book_genres USING btree (genre_id);


--
-- TOC entry 4845 (class 1259 OID 16852)
-- Name: IDX_79fe01ee56d95d10eaa9e50306; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_79fe01ee56d95d10eaa9e50306" ON public.user_genres USING btree (user_id);


--
-- TOC entry 4846 (class 1259 OID 16853)
-- Name: IDX_c4f883a5d7a825a13d26264d8a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c4f883a5d7a825a13d26264d8a" ON public.user_genres USING btree (genre_id);


--
-- TOC entry 4850 (class 1259 OID 16859)
-- Name: IDX_dc378b8311ff85f0dd38f16309; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_dc378b8311ff85f0dd38f16309" ON public.book_genres USING btree (book_id);


--
-- TOC entry 4872 (class 2606 OID 16961)
-- Name: cart_item FK_000223a640e2a9ccc498781788f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_000223a640e2a9ccc498781788f" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 4870 (class 2606 OID 16946)
-- Name: coupon FK_05e2d1d174be912392277fc095c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT "FK_05e2d1d174be912392277fc095c" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4867 (class 2606 OID 16931)
-- Name: comment_like_dislike FK_08e018b317152ae425cb1ca8c70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_like_dislike
    ADD CONSTRAINT "FK_08e018b317152ae425cb1ca8c70" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4874 (class 2606 OID 16966)
-- Name: order FK_199e32a02ddc0f47cd93181d8fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4875 (class 2606 OID 16976)
-- Name: order FK_1df473e977ba1d06a10b86813b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_1df473e977ba1d06a10b86813b3" FOREIGN KEY (used_coupon_id) REFERENCES public.coupon(id);


--
-- TOC entry 4863 (class 2606 OID 16911)
-- Name: review_like_dislike FK_2021745aad34205049a92945ba9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_like_dislike
    ADD CONSTRAINT "FK_2021745aad34205049a92945ba9" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4871 (class 2606 OID 16951)
-- Name: shopping_cart FK_2486032b4fc81da82629c53f955; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT "FK_2486032b4fc81da82629c53f955" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4855 (class 2606 OID 16871)
-- Name: friend_request FK_37d2ace7f95c1dd0ae665a570dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_request
    ADD CONSTRAINT "FK_37d2ace7f95c1dd0ae665a570dd" FOREIGN KEY (sender_id) REFERENCES public."user"(id);


--
-- TOC entry 4882 (class 2606 OID 17011)
-- Name: book_genres FK_43ff7d87d7506e768ca6491a1dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT "FK_43ff7d87d7506e768ca6491a1dd" FOREIGN KEY (genre_id) REFERENCES public.genre(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4854 (class 2606 OID 16866)
-- Name: customer_address FK_461eb4f521390db881a417437c1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT "FK_461eb4f521390db881a417437c1" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4864 (class 2606 OID 24891)
-- Name: review_like_dislike FK_47f9c3408dbd15e8e45fc29f5e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_like_dislike
    ADD CONSTRAINT "FK_47f9c3408dbd15e8e45fc29f5e5" FOREIGN KEY (review_id) REFERENCES public.review(id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 24901)
-- Name: comment_like_dislike FK_49fb9e3b13af95c3cadf11996d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_like_dislike
    ADD CONSTRAINT "FK_49fb9e3b13af95c3cadf11996d5" FOREIGN KEY (comment_id) REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- TOC entry 4880 (class 2606 OID 16996)
-- Name: user_genres FK_79fe01ee56d95d10eaa9e50306d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_genres
    ADD CONSTRAINT "FK_79fe01ee56d95d10eaa9e50306d" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4861 (class 2606 OID 16901)
-- Name: review FK_81446f2ee100305f42645d4d6c2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4856 (class 2606 OID 16876)
-- Name: friend_request FK_8eab7302f5d06dad73d5abd4fd9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.friend_request
    ADD CONSTRAINT "FK_8eab7302f5d06dad73d5abd4fd9" FOREIGN KEY (reciever_id) REFERENCES public."user"(id);


--
-- TOC entry 4865 (class 2606 OID 24896)
-- Name: comment FK_95f093aedad4d0fe6901890a645; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_95f093aedad4d0fe6901890a645" FOREIGN KEY (review_id) REFERENCES public.review(id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 16896)
-- Name: wish_list FK_a285dab60666a68661712ad6057; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish_list
    ADD CONSTRAINT "FK_a285dab60666a68661712ad6057" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 4857 (class 2606 OID 16886)
-- Name: read_status FK_a3d6e8363414f1e4f1af999d6e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.read_status
    ADD CONSTRAINT "FK_a3d6e8363414f1e4f1af999d6e8" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 4873 (class 2606 OID 16956)
-- Name: cart_item FK_b6b2a4f1f533d89d218e70db941; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941" FOREIGN KEY (cart_id) REFERENCES public.shopping_cart(id);


--
-- TOC entry 4858 (class 2606 OID 16881)
-- Name: read_status FK_ba0491fd8de23a34dd3df4df18a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.read_status
    ADD CONSTRAINT "FK_ba0491fd8de23a34dd3df4df18a" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4853 (class 2606 OID 16861)
-- Name: book FK_baaa4c0d27070b4125aa5a81e25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT "FK_baaa4c0d27070b4125aa5a81e25" FOREIGN KEY (publisher_id) REFERENCES public."user"(id);


--
-- TOC entry 4866 (class 2606 OID 16921)
-- Name: comment FK_bbfe153fa60aa06483ed35ff4a7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4860 (class 2606 OID 16891)
-- Name: wish_list FK_c23debb14a44001e4c5ffb3169d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish_list
    ADD CONSTRAINT "FK_c23debb14a44001e4c5ffb3169d" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 4881 (class 2606 OID 17001)
-- Name: user_genres FK_c4f883a5d7a825a13d26264d8ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_genres
    ADD CONSTRAINT "FK_c4f883a5d7a825a13d26264d8ad" FOREIGN KEY (genre_id) REFERENCES public.genre(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4862 (class 2606 OID 16906)
-- Name: review FK_c8c387802649e72190078ed5a78; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_c8c387802649e72190078ed5a78" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 4877 (class 2606 OID 16991)
-- Name: order_item FK_cdde79dbf105a2404c4f1ae687d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_cdde79dbf105a2404c4f1ae687d" FOREIGN KEY (discount_id) REFERENCES public.discount(id);


--
-- TOC entry 4883 (class 2606 OID 17006)
-- Name: book_genres FK_dc378b8311ff85f0dd38f163090; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT "FK_dc378b8311ff85f0dd38f163090" FOREIGN KEY (book_id) REFERENCES public.book(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 16981)
-- Name: order_item FK_e9674a6053adbaa1057848cddfa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- TOC entry 4876 (class 2606 OID 16971)
-- Name: order FK_f07603e96b068aae820d4590270; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_f07603e96b068aae820d4590270" FOREIGN KEY (address_id) REFERENCES public.customer_address(id);


--
-- TOC entry 4879 (class 2606 OID 16986)
-- Name: order_item FK_fe9af55afccab0788f82ed7f2c6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_fe9af55afccab0788f82ed7f2c6" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 4869 (class 2606 OID 16941)
-- Name: discount FK_ff04bee67c0824bce3616795a18; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT "FK_ff04bee67c0824bce3616795a18" FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-01-02 20:25:49

--
-- PostgreSQL database dump complete
--

