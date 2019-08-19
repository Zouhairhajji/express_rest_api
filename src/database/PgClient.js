const { Pool } = require("pg");

module.exports = class PgClient {
  constructor() {
    this.auth_params = {
      user: "zouhairhajji",
      password: "",
      host: "localhost",
      port: 5432,
      database: "financial_opportunities"
    };
  }

  connect() {
    if (PgClient.client_pg == undefined) {
        PgClient.client_pg = new Pool(this.auth_params);
      console.info("[DB]", "database initialized");
    } else {
      //console.info("[DB]", "database already initialized");
    }
  }

  execute(query) {
    return PgClient.client_pg.query(query);
  }
};
