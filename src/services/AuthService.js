const PgClient = require("../database/PgClient");
const uuid = require("uuid");

module.exports = class AuthService {
  constructor() {
    AuthService.endPoints = [];
    this.db_client = new PgClient();
    this.db_client.connect();
  }

  /**
   * la méthode permet de lister tous les tokens
   *
   * @returns {Array}
   */
  get_tokens() {
    return AuthService.endPoints;
  }


  /**
   * 
   * la méthode permet d'évaluer le role d'un utilisateur
   * 
   * @param {string} email 
   * @param {string} role_name 
   */
  has_role_by_email(email, role_name) {
    return this.get_roles_by_email(email)
      .then(data => data.rows.map(e => e.role))
      .then(roles =>  roles.filter(e => e === role_name).length > 0 )
      .catch(e => console.info(e));
  }

  /**
   *
   * @param {string} username
   * @param {string[]} roles
   * @param {string} ip
   */
  register_endpoint(username, roles, ip) {
    AuthService.endPoints = AuthService.endPoints.filter(
      x => x.username !== username
    );
    let uuid_code = uuid.v1();
    let mapped_roles = roles.map(e => e.role);

    AuthService.endPoints.push({
      created_at: new Date(),
      token: uuid_code,
      roles: mapped_roles,
      username: username,
      ip: ip,
      expiration: 60
    });

    console.table(AuthService.endPoints);
    return uuid_code;
  }

  /**
   * la méthode permet de faire ca et ca
   * @returns Promise
   */
  get_users() {
    let query = "select * from algo_cross_selling_analysis";
    return this.db_client.execute(query);
  }

  /**
   *
   * @param {string} username
   * @returns {Promise}
   */
  get_roles_by_email(username) {
    var query = `
            SELECT DISTINCT( r.role )
            FROM users u
            LEFT JOIN role_users  ru on u.id_user = ru.id_user
            LEFT JOIN roles  r on r.id_role = ru.id_role
            WHERE 1=1
                AND u.email = '${username}'
        `;
    return this.db_client.execute(query);
  }


  get_user_by_email(username) {
    var query = `
        SELECT distinct u.*
        FROM users u
        INNER JOIN role_users  ru on u.id_user = ru.id_user
        INNER JOIN roles  r on r.id_role = ru.id_role
        WHERE 1=1
            AND u.email = '${username}'
    `;

    return this.db_client.execute(query)
      .then(data => data.rows);
  }
};
