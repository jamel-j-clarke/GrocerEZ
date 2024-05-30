module.exports = class {
    id = null;
    name = null;
  
    constructor(data) {
      this.id = data.lis_id;
      this.name = data.lis_name;
    }
  
  };