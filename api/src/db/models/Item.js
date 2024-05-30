module.exports = class {
    id = null;
    name = null;
    quantity = null;
  
    constructor(data) {
      this.id = data.it_id;
      this.name = data.it_name;
      this.quantity = data.it_qt;
    }
  
  };