const UserEndpoint = `http://localhost:7001/users`;

describe('User API CRUD Tests', () => {
  let userId;
  let token;
  let userdata = {
    name: 'Dan George',
    email: 'dangeorge35@gmail.com',
    password: 'Dannex35'
  };

  it('should create a user, if not previously available', () => {
    const credential = { email: userdata.email, password: userdata.password };

    cy.request({
      method: 'POST',
      url: `http://localhost:7001/auth`,
      body: credential,
      failOnStatusCode: false // Allow non-2xx status codes
    }).then((response) => {
      // Check if email is not found (status 400)
      if (response.status === 400 && response.body.message === 'Email Address Not Found!') {
        // If email is not found, create a new user
        cy.request('POST', UserEndpoint, userdata).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.eq(true);
          expect(response.body.data).to.have.property('id');
          userId = response.body.data.id;
        });
      }
    });
  });

  it('should login the user', () => {
    const credential = { email: userdata.email, password: userdata.password };
    cy.request('POST', `http://localhost:7001/auth`, credential).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body).to.have.property('token');
      token = response.body.token;
      userId = response.body.data.id;
    });
  });

  it('should get a user by ID', () => {
    cy.request('GET', `${UserEndpoint}/${userId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body.data).to.have.property('id', userId);
    });
  });
});
