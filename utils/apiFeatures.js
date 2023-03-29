class ApiFeatures{
 constructor(query,queryStr){
    this.query = query
    this.queryStr = queryStr
 }
 search = () =>{
   const keyword = this.queryStr.keyword?{
    name:{
        $regex:this.queryStr.keyword,
        $options:'i'
    }
   }:{}
   this.query = this.query.find({...keyword})
   return this;
 }

 filter = () =>{
    const queryStrCopy = {...this.queryStr}
    //Remove some keyword
    const removeFields = ['keyword','page','limit'];

    removeFields.forEach((key)=>delete queryStrCopy[key])

    // Filter price range
    let queryStr = JSON.stringify(queryStrCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key =>`$${key}`)

    this.query = this.query.find(JSON.parse(queryStr))

    return this
 }

 pagination(pagelimit){
    const currentPage = this.queryStr.page || 1 ;
    const skip = pagelimit * (currentPage - 1);
    
    this.query = this.query.limit(pagelimit).skip(skip)

    return this
 }

}

module.exports = ApiFeatures