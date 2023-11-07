module.exports = {
  "api" :{
    input:{
      target:"http://localhost:8082/api/swagger/doc.json"
    },
    output:{
      target:"./src/lib/endpoint/index.tsx",
      schemas:"./src/lib/endpoint/schema",
      client: 'react-query',
      override:{
        mutator:{
          path:"./src/lib/endpoint/instance.tsx",
          name:"instance"
        }
      }
    }
  }
}