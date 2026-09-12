import request from 'supertest';
import app from '../../src/app.js';
import { getToken } from '../helpers/auth.js';
import { expect } from 'chai';

describe('Alunos', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    })

    it('deve cadastrar o aluno com sucesso', async () => {
        const cadastrarAluno = await request(app)
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: "Hanrrison Oliveira",
                email: "hanrrison.oliveira@example.com",
                matricula: "2026-0001",
                senha: "123456"
             });
            
        // Validar que ele foi cadastrado
        expect(cadastrarAluno.status).to.equal(201);
        expect(cadastrarAluno.body.nome).to.equal("Hanrrison Oliveira");
        expect(cadastrarAluno.body.email).to.equal("hanrrison.oliveira@example.com");
        expect(cadastrarAluno.body.matricula).to.equal("2026-0001");
    })
})