describe('QuizTestComponent', () => {
  beforeEach(() => {
    cy.visit('/quizprueba');
  });

  it('permite responder y muestra 100 si todo es correcto', () => {
    cy.get('input[name="question-0"]').check('París');
    cy.get('input[name="question-1"]').check('4');
    cy.contains('Entregar examen').click();

    cy.contains('Tu calificación final:', { timeout: 5000 }).should('exist');
    cy.contains('100 / 100', { timeout: 5000 }).should('exist');
    cy.contains('Excelente').should('exist');
  });

  it('muestra puntuación parcial si hay errores', () => {
    cy.get('input[name="question-0"]').check('Madrid');
    cy.get('input[name="question-1"]').check('4');
    cy.contains('Entregar examen').click();

    cy.contains('Tu calificación final:', { timeout: 5000 }).should('exist');
    cy.contains('50 / 100').should('exist');
    cy.contains('Necesita mejorar').should('exist');
  });
});
