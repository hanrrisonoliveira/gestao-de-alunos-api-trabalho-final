import { api } from '../helpers/api.js';
import { expect } from 'chai';
import testesDeAluno from '../fixtures/aluno.json' with { type: 'json' };

describe('Login', () => {
    it('deve logar com sucesso como Administrador', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            })

        expect(loginResposta.status).to.equal(200);
    })

    describe('DDT - Data Driven Testing', () => {
        testesDeAluno.forEach(testeDeAluno => {
            it(testeDeAluno.testTitle, async () => {
                const loginResposta = await api()
                    .post('/api/auth/login')
                    .set('Content-Type', 'application/json')
                    .send(testeDeAluno.dadosAluno);

                expect(loginResposta.status).to.equal(200);
            });
        });
    });
});