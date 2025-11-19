
# Koi

A budgeting app with gamified goals.

Your task is to create the backend for this app using fastapi.
The database should use postgresql with sqlmodel as the orm.

## Models

### User

```json
{
	"id": "asdas",
	"email": "@a.com",
	"name": "jere",
	"hashedPassword": "", // dont send as response,
	"unused_budget": 123,
	"budget": 123
}
```

### Budget History

```json
{
	"user_id": "aiueo",
	"month": 1,
	"year": 2025,
	"budget": 123,
}
```

### Expense

```json
{
	
	"user_id": "",
	"items": [],
	"subtotal": 123,
	"tax": 123,
	"service": 123,
	"discount": 123,
	"total_expense": 123, // before split bill
	"total_my_expense": 123, // after split bill reduction
	"category": "amogus",
	"datetime": DateTime,
	"members": ["Skibidi", "Samuel"],
	"vendor": "mcd"
}
```

### Expense Item

```json
{
	"name": "bigmac",
	"quantity": 123,
	"single_price": 123,
	"assigned_member": "" // none if self
}
```

### Subscription

```json
{
	"user_id": "",
	"name": "asdas",
	"category": "amogus",
	"price": 1231,
	"interval: "monthly/2month"
}
```

### Goal Item

```json
{
	"user_id": "",
	"name": "rtx",
	"price": 200,
	"deposited": 100,
	"completed": false,
	"completed_at": DateTime,
	"created_at": DateTime
}
```

## Features

### Sign Up

Done

### Login

Done

Sets HttpOnly Cookie `access_token`

### Get User

GET `/api/user`

*Requires Auth*

Response Body

```json
{
	"id": "asdas",
	"email": "@a.com",
	"name": "jere",
	"unused_budget": 123,
	"budget": 123
}
```

### Set Budget

PUT `/api/user/budget`

*Requires Auth*

Request Body

```json
{
	"budget": 123,
}
```

### Adding Expense

There's 2 ways to do this

**Add manually**

POST `/api/expense`

*Requires Auth*

```json
{
	"items": [
		{
			"name": "bigmac",
			"quantity": 123,
			"single_price": 123,
			"assigned_member": "" // none if self
		}
	],
	"subtotal": 123,
	"tax": 123,
	"service": 123,
	"discount": 123,
	"category": "amogus",
	"datetime": DateTime,
	"members": ["Skibidi", "Samuel"],
	"vendor": "mcd"
}
```

**Scan expense by camera**

POST `/api/expense/ocr`

*Requires Auth*

Request: FormData (image)

Response Body

```json
{
	"items": [
		{
			"name": "bigmac",
			"quantity": 123,
			"single_price": 123,
			"assigned_member": "" // none if self
		}
	],
	"subtotal": 123,
	"tax": 123,
	"service": 123,
	"discount": 123,
	"category": "amogus",
	"datetime": DateTime,
	"members": ["Skibidi", "Samuel"],
	"vendor": "mcd"
}
```

And then show create struk form with prefilled values

After that flow is same as **Add Manually**

### Edit Expense

Expenses from previous month can't be edited/deleted

PUT `/api/expense/{expenseid}`

### Delete Expense

Expenses from previous month can't be edited/deleted

DELETE `/api/expense/{expense}`

### View Tracker

UI Mock:

![image.png](image.png)

GET `/api/expense/tracker`

1. View nth Month’s Expense History
2. View nth Month’s Expense
    1. Aggregate per weekly (total expense)

Because we’re already selecting by month we don’t need pagination

Request Body

### Add Goal Item

POST `/api/goal`

Request Body

```json
{
	"name": "rtx",
	"price": 200
}
```

### View Goal Item

GET `/api/goal`

Response Body

```json
{
	"user_id": "",
	"name": "rtx",
	"price": 200,
	"deposited": 100,
	"completed": false,
	"completed_at": DateTime,
	"created_at": DateTime
}
```

### Update Goal Item’s Deposit

Unused money is added at the end of month

User can assign anytime so long as it isnt **marked as completed**

If you subtract deposit → Add User.UnusedBudget

If you add deposit → Subtract User.UnusedBudget

### Mark Goal Item Completed

**Warn user that this can’t be undone**

This makes the goal uneditable

PUT `/api/wishlist/complete`