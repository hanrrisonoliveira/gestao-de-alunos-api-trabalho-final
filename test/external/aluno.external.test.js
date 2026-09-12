import { comTokenDeAdmin } from '../helpers/auth.js';
import { api } from '../helpers/api.js';
import { expect } from 'chai';

describe('Alunos', () => {
    let tokenAdmin;

    beforeEach(async () => {
        tokenAdmin = await comTokenDeAdmin();
    })

    it('deve cadastrar o aluno com sucesso', async () => {
        const cadastrarAluno = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', comTokenDeAdmin())
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