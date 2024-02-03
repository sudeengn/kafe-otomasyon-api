# Doldur kafana göre! 
 burayı da

## Kurulum

```
    $ git clone https://github.com/Tuntii/COFFELAB.git
    $ cd COFFELAB
    $ npm install
```
  - database.confi.js örnek olarak database.configexample.js'te belirtilmiştir

  ### Servisi çalıştırmak için
  ```
  $ nodemon app.js  
  ``` 
  - Nodemon yoksa yükleyin 
	## Testler

	Testleri çalıştırmak için aşağıdaki komutu çalıştırın

	```bash
	npm run test
	```

## API Uçları

## User Routes

### * Create Admin

`POST |  /api/v1/users/register` 

| Key       | Value          |
| --------- | -----------    |
| name      | Admin          |
| email     | admin@admin.com|
| password  | password       |
| phone     | +947187520     |
| isAdmin   | true           |


### * Login Admin

`POST |  /api/v1/users/login` 

| Key        | Value          |
| ---------  | -----------    |
| email      | admin@admin.com|
| password   | password       |

### * Get Admins

`GET |  /api/v1/users` 

### * Get Single Admin

`GET |  /api/v1/users/{id}` 

### * Delete Admin

`DELETE |  /api/v1/users/{id}` 

### * Get Admins Count

`GET |  /api/v1/users/get/count` 

## Category Routes

### * Create Category

`POST |  /api/v1/categories` 

| Key   | Value      |
| ------| ---------- |
| name  | Category 1 |
| icon  | icon-health|
| color | #55879     |

### * Get Categories

`GET |  /api/v1/categories` 

### * Get Single Category

`GET |  /api/v1/categories/{id}` 

### * Update Category

`PUT |  /api/v1/categories/{id}` 

| Key   | Value      |
| ------| ---------- |
| name  | Category 1 |
| icon  | icon-health|
| color | #55879     |

### * Delete Category

`DELETE |  /api/v1/categories/{id}`

## Product Routes

### * Create Product

`POST |  /api/v1/products` 

| Key            | Value           |
| ---------      | -----------     |
| name           | Product 1       |
| description    | Description     |
| richDescription| Rich Description|
| image          | image           |
| brand          | Brand 1         |
| price          | 50              |
| category       | {category_id}   |
| countInStock   | 100             |
| rating         | 4.5             |
| numReviews     | 40              |
| isFeatured     | true            |

### * Get Products

`GET |  /api/v1/products` 

###  * Get Single Category

`GET |  /api/v1/products/{id}` 

###  * Get Prodcut Counts

`GET |  /api/v1/products/get/count` 

###  * Get Featured Prodcut Counts

`GET |  /api/v1/products/get/featured/{count}`

### * Upload Galley Images

`POST |  /api/v1/products/gallery-images/{id}`
| Key            | Value           |
| ---------      | -----------     |
| images         | Array of images |

### * Update Product

`PUT |  /api/v1/products` 
| Key            | Value           |
| ---------      | -----------     |
| name           | Product 1       |
| description    | Description     |
| richDescription| Rich Description|
| image          | image           |
| brand          | Brand 1         |
| price          | 50              |
| category       | {category_id}   |
| countInStock   | 100             |
| rating         | 4.5             |
| numReviews     | 40              |
| isFeatured     | true            |

### * Delete Product

`DELETE |  /api/v1/products/{id}`

## Orders Routes

### * Create Order

`POST |  /api/v1/orders` 

```json
{
	"orderItems":[
		{
			"quantity": 3,
			"product" : "602e9c348e700335d8532b14"
		},
			{
			"quantity": 2,
			"product" : "602bde0161fcc409fc149734"
		}
	],
}
```
### * Get Orders

`GET |  /api/v1/orders` 

### * Get Single Order

`GET |  /api/v1/orders/{id}` 

### * Get Total Order Count

`GET |  /api/v1/orders/get/count`

### * Get Total Sales

`GET |  /api/v1/orders/get/totalsales`

### * Get User Order

`GET |  /api/v1/orders/get/usersorders/{userid}`

### * Update Single Order

`PUT |  /api/v1/orders/{id}` 

### * Delete Single Order

`DELETE |  /api/v1/orders/{id}` 

## Author
[Sude Engin](https://www.linkedin.com/in/sude-nur-engin-b0b148270/)


<p ><h2 align="center">Happy<i class="fa fa-heart" style="color:red;"></i> Hacking<i class="fa fa-code" style="color:orange;"> </i></h2></p>
