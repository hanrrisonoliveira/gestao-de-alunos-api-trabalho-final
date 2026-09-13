import { api } from '../helpers/api.js';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { expect } from 'chai';
import { novoAluno } from '../factories/alunosFactory.js';
import testesDeTrabalho from '../fixtures/trabalho.json' with { type: 'json' };

describe('Trabalhos', () => {
    it('deve registrar a entrega de um trabalho como aluno', async () => {
        const alunoId = 'aluno-ana-souza';
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'ana.souza@example.com',
                senha: '123456'
            });

        expect(loginResposta.status).to.equal(200);

        const registrarTrabalho = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${loginResposta.body.token}`)
            .send({
                disciplinaId: 'disciplina-matematica',
                titulo: 'Lista de Exercícios 2',
                descricao: 'Resolução dos exercícios de 21 a 40.'
            });

        expect(registrarTrabalho.status).to.equal(201);
        expect(registrarTrabalho.body.alunoId).to.equal(alunoId);
        expect(registrarTrabalho.body.disciplinaId).to.equal('disciplina-matematica');
        expect(registrarTrabalho.body.titulo).to.equal('Lista de Exercícios 2');
        expect(registrarTrabalho.body.status).to.equal('entregue');
    });

    it('deve permitir que um aluno recém-criado registre um trabalho', async () => {
        const tokenAdmin = await comTokenDeAdmin();
        const aluno = novoAluno();

        const alunoCriado = await api()
            .post('/api/admin/alunos')
            .set('Authorization', tokenAdmin)
            .send(aluno);

        expect(alunoCriado.status).to.equal(201);

        const alunoId = alunoCriado.body.id;
        const disciplinaId = 'disciplina-matematica';

        const matricula = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Authorization', tokenAdmin)
            .send({ alunoId });

        expect(matricula.status).to.equal(201);

        const login = await api()
            .post('/api/auth/login')
            .send({
                email: aluno.email,
                senha: aluno.senha
            });

        expect(login.status).to.equal(200);

        const entrega = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Authorization', `Bearer ${login.body.token}`)
            .send({
                disciplinaId,
                titulo: 'Trabalho de Matemática',
                descricao: 'Entrega do trabalho do aluno recém-criado.'
            });

        expect(entrega.status).to.equal(201);
        expect(entrega.body.alunoId).to.equal(alunoId);
        expect(entrega.body.disciplinaId).to.equal(disciplinaId);
        expect(entrega.body.status).to.equal('entregue');
    });

    describe('DDT - Data Driven Testing', () => {
        testesDeTrabalho.forEach(testeDeTrabalho => {
            it(testeDeTrabalho.testTitle, async () => {
                const loginResposta = await api()
                    .post('/api/auth/login')
                    .set('Content-Type', 'application/json')
                    .send(testeDeTrabalho.dadosAluno);

                expect(loginResposta.status).to.equal(200);

                const alunoId = loginResposta.body.usuario.id;

                const registrarTrabalho = await api()
                    .post(`/api/alunos/${alunoId}/trabalhos`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${loginResposta.body.token}`)
                    .send(testeDeTrabalho.dadosTrabalho);

                expect(registrarTrabalho.status).to.equal(testeDeTrabalho.statusCodeEsperado);
                expect(registrarTrabalho.body.alunoId).to.equal(alunoId);
                expect(registrarTrabalho.body.disciplinaId).to.equal(testeDeTrabalho.dadosTrabalho.disciplinaId);
                expect(registrarTrabalho.body.titulo).to.equal(testeDeTrabalho.dadosTrabalho.titulo);
                expect(registrarTrabalho.body.status).to.equal(testeDeTrabalho.dadosTrabalho.status);
            });
        })


    })

});