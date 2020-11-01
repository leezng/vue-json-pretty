/// <reference types="cypress" />

const text = JSON.stringify({ a: 1 });

context('Test', () => {
  it('Can pretty json', () => {
    cy.visit('/');
    cy.get('.vjs-tree');

    cy.get('textarea')
      .first()
      .clear()
      // .type('"string"')
      .type(text);
    // .should('have.value', '{"a":1}');
    // cy.get('.vjs-tree')
  });
});
