const env = process.env.NODE_ENV || "production";
const all = {
  https: {
    key: 123
  }
};

const environments = {
  development: {
    elasticsearch: {
      node: "http://localhost:9200",
      auth: {
        username: 'skiline_webuser',
        password: 'sk4md1sk'
      }
    }
  },
  production: {
    elasticsearch: {
      node: "http://10.183.160.51:9200",
      auth: {
        username: 'elastic',
        password: 'vfOK12.0912pf!'
      }
    }
  }
};

const settings = Object.assign(all, environments[env]);

module.exports = {
  settings
}
