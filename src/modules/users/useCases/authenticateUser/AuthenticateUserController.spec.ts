import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

// A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário 
// autenticado junto à um token JWT.

describe('return info the user authenticat', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    it("should return info the user authenticat",  async() => {

        const user = {
            name: "aloisio1",
            email: "aloisio1@testecontroller.com.br",
            password: "password",
        }
      
        const passwordHash = await hash(user.password, 8);

        const response = await request(app).post("/api/v1/users").send({
            name: user.name,
            email: user.email,
            password: passwordHash
        });

        const responseSession = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: passwordHash,
        });    
        
        expect(responseSession.status).toBe(200);
    })
})