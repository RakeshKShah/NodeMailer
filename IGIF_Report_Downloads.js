var mysql = require('mysql');
var nodemailer = require('nodemailer');
var markdown = require('nodemailer-markdown').markdown;

//mysql connecion info
var connection = mysql.createConnection(
{
	
		        host     : '_____.rds.amazonaws.com',
                user     : '**********',
                password : '**********',
                database : 'database',
                port     :  3306

});


//gmail login credentials 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '@gmail.com',
      pass: ''
    }
  });

  //what language you want to use for body of the email
  transporter.use('compile', markdown());
   
  var currentdate = new Date(); 
//   var datetime =  currentdate.getDate() + "-"
//                   + (currentdate.getMonth()+1)  + "-" 
//                   + currentdate.getFullYear() + " "  
//                   + currentdate.getHours() + ":"  
//                   + currentdate.getMinutes() + ":" 
//                   + currentdate.getSeconds();

  var currentYear = currentdate.getFullYear();
  var currentMonth = currentdate.getMonth() + 1;

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

//FOR December
if(currentMonth == 1)
{
    currentYear -=1;
    currentMonth = 12; 
}
//res is the result (Body of the email)  
var res = "City Annual Fiscal Conditions Reports downloaded in "+ monthNames[currentMonth-1] + " "+ currentYear +": ";
var MonthCityQuery = "SELECT Count(reportrequeststats.document) AS count FROM reportrequeststats WHERE reportrequeststats.year = "+ currentYear +" AND reportrequeststats.month = "+currentMonth +" AND (reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2016\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2015\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2014\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2013\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2017\")"

//Query and append into res 
connection.query(MonthCityQuery,function(err,result) 
{
    if(err)
    {
        throw err;
    }
    res += "**" + result[0].count + "**";
   
});

var CountyAnnualText = "County Annual Fiscal Conditions Reports downloaded in "+ monthNames[currentMonth-1] + " "+ currentYear+": ";
var MonthCountyQuery = "SELECT Count(reportrequeststats.document) AS count FROM reportrequeststats WHERE reportrequeststats.year = " + currentYear + " AND reportrequeststats.month = " + currentMonth +" AND( reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2016\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2015\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2014\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2013\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2017\") "; 

connection.query(MonthCountyQuery,function(err,result) 
{
    if(err)
    {
        throw err;
    }
    res += "\n\n" + CountyAnnualText +"**" + result[0].count +"**";
});

var CityAnnualText = "City Annual Fiscal Conditions Reports downloaded YTD: "
var CityQuery = "SELECT Count(reportrequeststats.document) AS count FROM reportrequeststats WHERE reportrequeststats.year = "+ currentYear +" AND (reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2016\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2015\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2014\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2013\" OR reportrequeststats.document = \"City Annual Fiscal Conditions Report FYE 2017\")";
connection.query(CityQuery,function(err,result) 
{
    if(err)
    {
        throw err;
    }
    res += "\n\n" + CityAnnualText + "**" + result[0].count + "**";
});

var CountyYTDText = "County Annual Fiscal Conditions Reports downloaded YTD: "
var CountyQuery = "SELECT Count(reportrequeststats.document) AS count FROM reportrequeststats WHERE reportrequeststats.year = " + currentYear + " AND( reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2016\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2015\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2014\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2013\" OR reportrequeststats.document = \"County Annual Fiscal Conditions Report FYE 2017\") ";
connection.query(CountyQuery,function(err,result) 
{
    if(err)
    {
        throw err;
    }
    res += "\n\n" + CountyYTDText + "**" + result[0].count +"**";
    console.log(res);
    var mailOptions = {
      from: '"Indicators ISU"<isuindicators@gmail.com>',
      to: '"Indicators ISU"<isuindicators@gmail.com>',				
      subject: 'IGFI Report Downloads',
      markdown: res + "\n\nCity Annual Fiscal Conditions Reports downloaded 2017: **296** \n\nCounty Annual Fiscal Conditions Reports downloaded 2017: **864** \n\nCity Annual Fiscal Conditions Reports downloaded 2016:**402** \n\nCounty Annual Fiscal Conditions Reports downloaded 2016:**466** <br/><br/><br/><br/><br/><br/><br/><br/> **Replies** to this email are **not monitored**. Please have your queries sent to indicators@iastate.edu ."
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });	
});