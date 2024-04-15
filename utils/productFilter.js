const { model } = require("mongoose");

class ProductFilter {
  // Initializing the ProductFilter class with the query and queryStr parameters
  constructor(query, queryStr) {
    this.query = query; //MongoDB query object
    this.queryStr = queryStr; // Query parameters received from the client
  }

  // Method to search products based on keyword
  search() {
    // Checking if a keyword is provided in the query string
    const keyword = this.queryStr.keyword
      ? {
          // regular expression to perform case-insensitive search on the 'name' field
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // Case-insensitive search
          },
        }
      : {};

    // Add the keyword filter to the MongoDB query
    this.query = this.query.find({ ...keyword });

    return this;
  }

  // Method to filter products based on query parameters
  filter() {
    //a copy of the query string object
    let queryCopy = { ...this.queryStr };

    // the query parameters that should not be included in the MongoDB query
    const deleteArea = ["keyword", "page", "limit"];

    deleteArea.forEach((item) => delete queryCopy[item]);

    // Converting the query string object to a JSON string
    let queryStr = JSON.stringify(queryCopy);

    // Replacing query operators (gt, gte, lt, lte) with MongoDB operators ($gt, $gte, $lt, $lte)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // Adding the filtered query parameters to the MongoDB query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Method to paginate the results
  pagination(resultPerPage) {
    // Extract the active page from the query string or default to the first page
    const activePage = this.queryStr.page || 1;

    // Calculate the number of documents to skip based on the resultPerPage and activePage
    const skip = resultPerPage * (activePage - 1);

    // Limit the number of documents returned and skip the specified number of documents
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ProductFilter;
