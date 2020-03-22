# Graphql poc using angular and mysql

## Setup 
- Start the services 
```bash
docker-compose up -d
```

- Add the test data to the database 
```bash
./restore_database.sh
```

## Sample query

```graphql
{
  customers (limit: 1, offset:0) {
    customerNumber
    customerName
    postalCode
  }

  employees (limit: 1) {
    employeeNumber
    lastName
		firstName
    jobTitle
    customers (limit: 2) {
    	customerName  
    }
  }

  customer (id:103) {
 		customerNumber
    customerName
    contactLastName
    # contactFirstName
    # salesRepEmployeeNumber
    creditLimit   
    salesRep {
      employeeNumber
      lastName
			firstName
    }
  }
  
  employee (id: 1002) {
    lastName
		firstName
    jobTitle
  }
}
``` 
