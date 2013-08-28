<?php
    $fileext = ".gexf";
    $data = "";
    if ($_POST['fileext']=="jpg")
    {
      $fileext = ".jpg";
      $data = base64_decode($_POST['imagedata']);
    }
    else if ($_POST['fileext']=="png")
    {
      $fileext = ".png";
      $data = base64_decode($_POST['imagedata']);
    }
    else if ($_POST['fileext']=="vna")
    {
      $fileext = ".vna";
      $data = str_replace("\\", "", $_POST['imagedata']);
    }
    else if ($_POST['fileext']=="gexf")
    {
      $fileext = ".gexf";
      $data = str_replace("\\", "", $_POST['imagedata']);
    }
    else if ($_POST['fileext']=="gexfd")
    {
      $fileext = ".gexf";
      $data = str_replace("\\", "", $_POST['imagedata']);
    }
    else if ($_POST['fileext']=="annotations")
    {
      $fileext = ".csv";
      $data = $_POST['imagedata'];
    }
    $content_disp = 'Content-disposition: attachment; filename=SNAPP' . $fileext;
    header('Content-Type: application/force-download');
    header($content_disp);
    print $data;
?>