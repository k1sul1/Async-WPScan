<?php
// pipe script output to this script
$error = false;
while(!feof(STDIN)){
  $line = fgets(STDIN);

  if(strpos($line,"[!]")){
    echo $line;
    $error = true;
  }
  else{

    if($error){
     if(strpos($line,"[+]")){
       $error = false;
     }
     else{
       echo $line;
     }
    }
  }
}