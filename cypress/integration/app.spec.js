describe('비디오 관련 액션 테스트', () => {
  beforeEach(() => {
    cy.viewport(1800, 900);
    cy.visit('http://localhost:9000/');
  });

  it('비디오 검색 후 비디오를 하나 저장하면 볼 영상에 저장한 비디오가 있어야 하고 본 영상 버튼을 클릭하면 본 영상 섹션에 비디오가 있어야 한다', () => {
    cy.get('#search-modal-button').click();
    cy.get('.search-input__keyword').type('잔나비');
    cy.get('.search-input__search-button')
      .click()
      .then(() => {
        cy.get('.video-item').get('h4').eq(0).invoke('text')
          .then((text1) => {
            cy.get('.video-item__save-button').first().click();
            cy.get('.dimmer').click({ force: true });
            const saveVideoTitle = cy.get('.video-item').get('h4').first();
            saveVideoTitle.should('have.text', text1);
            cy.get('.video-item').get('.watched-video-button').eq(0).click();
            cy.get('#watched-section-button').click();
            const watchedVideoTitle = cy.get('.video-item').get('h4').eq(0);
            watchedVideoTitle.should('have.text', text1);
          });
      });
  });

//   it('저장된 영상 섹션에서 영상을 삭제할 수 있어야 한다', () => {
//     cy.get('.video-item').get('.delete-video-button').eq(0).click();
//     cy.get('.watched-video').children().should('have.legnth', 0);
//   });
});
