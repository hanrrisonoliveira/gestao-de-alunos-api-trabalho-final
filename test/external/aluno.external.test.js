import { comTokenDeAdmin } from '../helpers/auth.js';
import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { novoAluno } from '../factories/alunosFactory.js';

describe('Alunos', () => {
    let tokenAdmin;

    beforeEach(async () => {
        tokenAdmin = await comTokenDeAdmin();
    })

    it('deve cadastrar o aluno com sucesso', async () => {
        const aluno = novoAluno();
        const cadastrarAluno = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', tokenAdmin)
            .send(aluno);
            
        // Validar que ele foi cadastrado
        expect(cadastrarAluno.status).to.equal(201);
        expect(cadastrarAluno.body.nome).to.equal(aluno.nome);
        expect(cadastrarAluno.body.email).to.equal(aluno.email);
        expect(cadastrarAluno.body.matricula).to.equal(aluno.matricula);
    })
})