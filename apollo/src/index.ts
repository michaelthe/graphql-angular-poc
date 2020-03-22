import {createConnection} from 'mysql2'
import {ApolloError, ApolloServer, gql, ValidationError} from 'apollo-server';

const connection = createConnection({
    host: process.env.DATABASE || 'localhost',
    user: 'root',
    password: 'password',
    database: 'graphql'
});

connection.connect();

async function select(query: string, params: any[] = []) {
    const [items] = await connection.promise().execute(query, params);
    return items
}

// connection
//     .promise()
//     .execute('select * from employees')
//     .then(([rows, fields]) => {
//         for (const f of fields) {
//             console.log(f.name + ': String')
//         }
//         console.log(rows[0])
//     });

const typeDefs = gql`
    type Customer {
        customerNumber: ID
        customerName: String
        contactLastName: String
        contactFirstName: String
        phone: String
        addressLine1: String
        addressLine2: String
        city: String
        state: String
        postalCode: String
        country: String
        salesRepEmployeeNumber: Int
        salesRep: Employee
        creditLimit: Float
    }

    type Employee {
        employeeNumber: ID
        lastName: String
        firstName: String
        extension: String
        email: String
        officeCode: String
        reportsTo: Int
        jobTitle: String
        customers(offset: Int, limit: Int): [Customer]
    }

    type Query {
        customer(id: Int!): Customer
        customers(offset: Int, limit: Int): [Customer]

        employee(id: Int!): Employee
        employees(offset: Int, limit: Int): [Employee]
    }
`;


const resolvers = {
    Query: {
        async customer(_: null, args: { id: number }) {
            try {
                const query = "SELECT * FROM customers WHERE customerNumber = ?";
                const params = [args.id];
                const items = await select(query, params);

                return items[0] || new ValidationError('User not found');
            } catch (error) {
                throw new ApolloError(error);
            }
        },

        async employee(_: null, args: { id: number }) {
            try {
                const query = "SELECT * FROM employees WHERE employeeNumber = ?";
                const params = [args.id];
                const items = await select(query, params);

                return items[0] || new ValidationError('Employee not found');
            } catch (error) {
                throw new ApolloError(error);
            }
        },

        async customers(_: null, args: { offset: number, limit: number }) {
            try {
                let query = "SELECT * FROM customers";
                let params = [];

                if (args.limit) {
                    query += ' LIMIT ?';
                    params.push(args.limit)
                }

                if (args.offset) {
                    query += ' OFFSET ?';
                    params.push(args.offset)
                }

                // console.log(query, params);
                return await select(query, params);
            } catch (error) {
                console.error(error);
                throw new ApolloError(error);
            }
        },

        async employees(_: null, args: { offset: number, limit: number }) {
            try {
                let query = "SELECT * FROM employees";
                let params = [];

                if (args.limit) {
                    query += ' LIMIT ?';
                    params.push(args.limit)
                }

                if (args.offset) {
                    query += ' OFFSET ?';
                    params.push(args.offset)
                }

                // console.log(query, params);
                return await select(query, params);
            } catch (error) {
                console.error(error);
                throw new ApolloError(error);
            }
        },
    },
    Customer: {
        async salesRep(customer) {
            try {
                const query = "SELECT * FROM employees WHERE employeeNumber = ?";
                const params = [customer.salesRepEmployeeNumber];
                const items = await select(query, params);

                return items[0] || new ValidationError('Employee not found');
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    },
    Employee: {
        async customers(employee, args: { offset: number, limit: number }) {
            try {
                let query = "SELECT * FROM customers WHERE salesRepEmployeeNumber = ?";
                let params = [employee.employeeNumber];

                if (args.limit) {
                    query += ' LIMIT ?';
                    params.push(args.limit)
                }

                if (args.offset) {
                    query += ' OFFSET ?';
                    params.push(args.offset)
                }

                return await select(query, params);
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
});

server
    .listen({port: process.env.PORT || 4000})
    .then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });
