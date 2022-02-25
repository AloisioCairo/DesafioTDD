import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

// A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.
describe('return info the user authenticat', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase(); 
        await connection.close();
    })

    it("should return info the user authenticat", async () => {
        const password = await hash("testeController", 8);

        const response = await request(app).post("/api/v1/users").send({
            name: "aloisio2",
            email: "aloisio2@teste.com.br",
            password: password
        });
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "aloisio2@teste.com.br",
            password: password,
        });

        const { token } = responseToken.body;

        const profile = await request(app).get("/api/v1/profile").set('Authorization', token);        
        
        expect(profile.status).toBe(200);
    })
})