//alert('SNAPP SAKAI file');


/* Creates a 2D array of specified depth. */

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}



/* Performs a web crawl on the Sakai Forums thread and de threads the forum into Social Network Analysis
   compatible posted_by , posted on , in reply_to , in forum thread on LMS Sakai format. The SNA relationships 
   forwarded feed the SNAPP visualization engine to help the faculty identify the learning patterns of the students.*/

   
function PerformSocialAnalysisSakai()
{

  //alert("Perform Social analysis: Initiated!")
  
  
  // isolates the content from the Iframe which contains the Forum portlet.
  forumIframe = jQuery(".portletMainIframe").contents();	
  
  // message metadata is the class associated with each individual posts giving important details like the posted by , posted on information
  allForumPostsTables = jQuery(".portletMainIframe").contents().find(".messageMetadata");
 
  
  // This 2D array has the ability to handle forum thread reply nesting of depth 100. It contains information 
  // about the siblings(forum users at the same Level in the reply hierarchy) in the   
  
  var forumHierarchyList = Create2DArray(100);
  

  // navigates through each of the forum message meta data to isolate the required information 
  for (i=0; i < allForumPostsTables.length; i++)
  {

    posted_by = allForumPostsTables[i].innerHTML;
    //alert("posted_by: " + posted_by);
    
	// Isolating the forum user responsible for posting the forum message
	if (posted_by.indexOf('>')!=-1)
	{
    posted_by = posted_by.substring(posted_by.indexOf('md">')+1,posted_by.length);
    posted_by = posted_by.substring(3,posted_by.indexOf('<'));
    }
	
	posted_by = trim(posted_by);
	//alert("posted_by:" + posted_by);
	
	// creates an array consisting of all forum users participating
	if (forumusers[posted_by])
    {
    forumusers[posted_by] = forumusers[posted_by] + 1;
    }
    else
    {
    forumusers[posted_by] = 1;
    }
	
	//alert("forum users:" + forum users[posted_by]);
	
	// Isolating the Forum Posted on information.
	posted_on = allForumPostsTables[i].innerHTML; 
	
	//alert("posted on innerHTML :" + posted_on);
    posted_on = posted_on.substring(posted_on.indexOf('"> (')+1,posted_on.length);
    //alert("posted on innerHTML :" + posted_on);
	posted_on = posted_on.substring(3,posted_on.indexOf(')'));
	
    //alert("posted_on:" + posted_on);

    // Converting date format for Sakai into Moodle format
	// March 19, 2010, 7:55 AM --- moodle example
	// Oct 16, 2012 12:57 PM ---- sakai example
	month = ConvertMonth(posted_on.substring(0,3));

	date = posted_on.substring(3,posted_on.indexOf(',')+1);
	
	year = posted_on.substring(posted_on.indexOf(',')+1,posted_on.indexOf(',')+6)
		
	time = posted_on.substring(posted_on.length - 8, posted_on.length);
	
	//alert("Month: "+ month +" Date: " + date +" Year" + year +" time: "+time);
	
	posted_on = month + date + year + ", "+ trim(time);
	
	//alert("Formatted posted on:" +posted_on);
	
	//retrieving padding left value for each row by finding the rowcount for the particular message.
	row = jQuery(".portletMainIframe").contents().find("tr[rowcount="+i+"]")[0].innerHTML;
	currentPostHierPadding = row.substring(row.indexOf('em;\"><a '),40);
	
    //alert("padding left :" +currentPostHierPadding); //"   Next post padding:" +nextPostHierPadding);
	
    //alert("postedby:" + posted_by);
    //alert("postedon:" + posted_on);
	
	
	// Convert the time to a format compatible with the visualization process
	var posted_onObj = moment(posted_on);
    posted_on = posted_onObj.format("D MMMM YYYY")
    posted_on += ", " + trim(time);
	
	// Attachments which are actually part of the Forum post but each attachment is allocated a new row count. 
	// The attachments do not have the forum padding information and therefore results in a exception.
    // The idea is to continue the loop to process the next row count information when the processor encounters attachments.
	
	try{
	   forumHierarchyList[currentPostHierPadding][forumHierarchyList[currentPostHierPadding].length] = posted_by ;
	}
	catch(e){
	    continue;
	}
	
	//alert("Content: ["+currentPostHierPadding+"]["+(forumHierarchyList[currentPostHierPadding].length) - 1 +"] :"+ forumHierarchyList[currentPostHierPadding][(forumHierarchyList[currentPostHierPadding].length) - 1] );
	
	threadowners[currentPostHierPadding] = posted_by;
	
	forumCreator = '';
	reply_to = "-";
	
	// Forum hierarchy "0" represents that the user is the forum owner.
	if (currentPostHierPadding == 0){
		forumCreator = posted_by;
		//alert(" posted_by:" + posted_by + " posted_on:" + posted_on + " reply_to:" + reply_to);
	}
	else{
	    // navigate through the forum hierarchy array and find the previous level of indentation and the last forum user. This gives us the information as to whom the user is replying to. 
		reply_to = forumHierarchyList[currentPostHierPadding - 1][forumHierarchyList[currentPostHierPadding - 1].length - 1];
		//alert(" posted_by:" + posted_by + " posted_on:" + posted_on + " reply_to:" + reply_to);
	}
	
	// Creating SNA_relationships
	sna_relationship = posted_by + "_" + reply_to;
      //alert(sna_relationship);
    if (replies[sna_relationship])
      {
        replies[sna_relationship] += 1;
	  }
      else
      {
        replies[sna_relationship] = 1;
		 
      }
    
    totalposts = totalposts + 1;
    
	// Currently SNAPP does not have an integration with Sakai. Hence it does not handle addition of posts with Sakai as an LMS metric.
	// Hence we use Moodle as a parameter to help the application recognize the forum posts and process visualization. 
	
    AddPost(posted_by, reply_to, posted_on, 1, "Sakai");
	 
  }
  
  //alert("Level 0:" +forumHierarchyList[0]);
  //alert("Level 1:" +forumHierarchyList[1]);
  //alert("Level 2:" +forumHierarchyList[2]);
  //alert("Level 3:" +forumHierarchyList[3]);
  
  
  }
  
  
  function ConvertMonth(month)
{

	month = month.replace("Jan", "January");
	month = month.replace("Feb", "February");
	month = month.replace("Mar", "March");
	month = month.replace("Apr", "April");
	month = month.replace("May", "May");
	month = month.replace("Jun", "June");
	month = month.replace("Jul", "July");
	month = month.replace("Aug", "August");
	month = month.replace("Sep", "September");
	month = month.replace("Oct", "October");
	month = month.replace("Nov", "November");
	month = month.replace("Dec", "December");

	return month;

}

function trim(stringToTrim) { 
    stringToTrim = stringToTrim.replace(/(^\s*)|(\s*$)/gi,"");
    stringToTrim = stringToTrim.replace(/[ ]{2,}/gi," "); 
    stringToTrim = stringToTrim.replace(/\n /,"\n"); return stringToTrim;
}
  
  

 