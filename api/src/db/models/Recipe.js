module.exports = class {
    id = null;
    name = null;
  
    constructor(data) {
      this.id = data.rec_id;
      this.name = data.rec_name;
    }
  
  };