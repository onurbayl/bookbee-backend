# Database Content
## User
-	User ID : Long (PK)
-	OIDC ID : varchar/ID <Firebase_user_id>
-	Name : varchar
-	Email : varchar
-	Image_path : varchar <Not_sure>
-	Balance : Float
-	Description : varchar
-	Is_deleted : boolean
## Customer_Address
-	Address ID : Long (PK)
-	User ID : Long (FK - User)
-	Address_Info : Varchar
-	Current: Boolean
-	Start_date : Timestamp
-	End_date: Timestamp
## Friend_Request**
-	Request ID : Long (PK)
-	Sender ID : Long (FK - User)
-	Reciever ID : Long (FK - User)
-	Date_request : Timestamp
-	Date_answered : Timestamp
## Book
-	Book Id : Long (PK)
-	Name : varchar
-	Description : varchar
-	Price : Float
-	Publisher : Long (FK - User)
-	Writer : varchar <Not_sure>
-	Page_number : Long
-	Date_published : Date
-	Language : varchar
-	Book_Dimension : varchar
-	Barcode : varchar
-	ISBN : varchar
-	Edition_Number : Long
-	Image_path : varchar
-	is_deleted : boolean
## Read_Status
-	Read_Status ID : Long (PK)
-	User ID : Long (FK - User)
-	Book Id : Long (FK - Book)
-	Status : varchar <could_work>
-	Date : Timestamp <Maybe_not_used>
## Genre
-	Genre ID : Long (PK)
-	Genre_name : varchar
## Book_Genre: ORM otomatik oluşturuyor
-	Book ID : Long (FK - Book)
-	Genre ID : Long (FK - Genre)
## User_Genre: ORM otomatik oluşturuyor
-	User ID : Long (FK - User)
-	Genre ID : Long (FK - Genre)
## Wish List
-	Wish_List ID : Long (PK)
-	User ID : Long (FK – User)
-	Book ID : Long (FK - Book)
-	Date_added : Timestamp
-	Order : Long <Extra_feature–may_removed>
## Review
-	Review ID : Long (PK)
-	User ID : Long (FK - User)
-	Book ID : Long (FK - Book)
-	Score : Long <1-10 arasında>
-	Content : varchar
-	Date_created : Timestamp
## Review_Like_Dislike ***
-	Review_Like_Dislike ID : Long (PK)
-	User ID : Long (FK - User)
-	Review ID : Long (FK - Review)
-	Like_Dislike : Long <1 if  like, -1 if dislike>
-	Date_created : Timestamp
## Comment
-	Comment  ID : Long (PK)
-	User ID : Long (FK - User)
-	Review ID : Long (FK - Review)
-	Content : varchar
-	Date_created: Timestamp
## Comment_Like_Dislike ***
-	Comment_Like_Dislike ID : Long (PK)
-	User ID : Long (FK - User)
-	Comment ID : Long (FK – Comment)
-	Like_Dislike : Long <1 if  like, -1 if dislike>
-	Date_created: Timestamp
## Discount
-	Discount ID : Long (PK)
-	Book ID : Long (FK - Book)
-	Discount_percentage : Long
-	Start_date : Timestamp
-	End_date: Timestamp
## Coupon
-	Coupon ID : Long (PK)
-	User ID : Long (FK - User)
-	Discount_percentage: Long
-	Start_date : Timestamp
-	End_date : Timestamp
-	Used : Boolean
## Shopping Cart*
-	Cart ID : Long (PK)
-	User ID : Long (FK - User)
## Cart Items*
-	Cart_Item_ID : Long (PK)
-	Cart ID : Long (FK - Cart)
-	Book ID : Long (FK - Book)
-	Quantity : Long
## Order/Receipt
-	Order ID : Long (PK)
-	User ID : Long (FK – User)
-	Address ID : Long (FK – Address)
-	Order_date : Timestamp
-	Used_Coupon_ID : Long (FK – Coupon)
-	Total_Price : Float <Keeping it is better. Less calculation and it wont be updated after creation.>****
## Order Items
-	Order_Item_ID : Long (PK)
-	Order ID : Long (FK - Order)
-	Book ID : Long (FK - Book)
-	Quantity : Long
-	Unit_price : Float <Without discount>
-	Discount ID : (FK - Discount) <br/>

\* Data in the cart table is stored temporarily. Don't forget to delete it after the sale is completed. <br/>
\*\* Is there a friendship to be double-checked? If there is 5-10, it will not be 10-5, but there is still a relationship between them. Also, there are no blocking or rejecting situations at the moment. <br/>
\*\*\* Likes are designed to be deleted from the table when canceled. We can change this if we want. <br/>
\*\*\*\* Order Price = Total( item \* discount ) \* Coupon, coupons are universally valid. If we want to change this, we just need to move the used coupon to the Order Items table.
