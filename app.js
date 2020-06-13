const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const router = express.Router();

router.get('/', function(request,response){
  response.sendFile(path.join(__dirname+'/index.html'));
})
//add the router
app.use('/', router);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//allow charge static files from root
app.use(express.static('.'))