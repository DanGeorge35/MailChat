const ProviderEndpoint = 'http://localhost:7001/providers';

describe('Provider API CRUD Tests', () => {
  let slug;
  let accessToken;

  let userdata = {
    name: 'Dan George',
    email: 'dangeorge35@gmail.com',
    password: 'Dannex35'
  };

  it('should login the user', () => {
    const credential = { email: userdata.email, password: userdata.password };
    cy.request('POST', `http://localhost:7001/auth`, credential).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('token');
      accessToken = response.body.token;
    });
  });

  it('should get all providers ', () => {
    cy.request({
      method: 'GET',
      url: `${ProviderEndpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      slug = response.body.data[0]['slug'];
    });
  });

  it('should get provider packages by slug', () => {
    cy.request({
      method: 'GET',
      url: `${ProviderEndpoint}/${slug}/packages`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
