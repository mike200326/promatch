describe("Flujo completo del examen de prueba", () => {
  it("visita la introducción, inicia el examen, responde y entrega", () => {
    // 1. Ir a la pantalla de introducción
    cy.visit("/examen/prueba");

    // 2. Verifica que estamos en la pantalla de introducción
    cy.contains("Examen de prueba técnica").should("exist");
    cy.contains("Iniciar examen").should("exist");

    // 3. Click en iniciar
    cy.contains("Iniciar examen").click();

    // 4. Verifica que estamos en /examen/iniciar/prueba
    cy.url().should("include", "/examen/iniciar/prueba");

    // 5. Responde las preguntas
    cy.get('input[name="question-0"]', { timeout: 5000 }).should("exist").check("París");
    cy.get('input[name="question-1"]').check("4");

    // 6. Entrega el examen
    cy.contains("Entregar examen").click();

    // 7. Verifica el resultado
    cy.contains("Tu calificación final:").should("exist");
    cy.contains("100 / 100").should("exist");
    cy.contains("Excelente").should("exist");
  });
});
