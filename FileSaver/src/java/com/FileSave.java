package com;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

public class FileSave extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		PrintWriter out = response.getWriter();
		String fileExt = null;
		String data = null;
		
		switch (request.getParameter("fileext")) {
		case "jpg": 
			fileExt = ".jpg";
			data = DatatypeConverter.parseBase64Binary(request.getParameter("imagedata")).toString();
			break;
		case "png": 
			fileExt = ".png";
			data = DatatypeConverter.parseBase64Binary(request.getParameter("imagedata")).toString();
			break;
		case "vna":
			fileExt = ".vna";
			data = request.getParameter("imagedata").replace("\\", "");
			break;
		case "gexf":
			fileExt = ".gexf";
			data = request.getParameter("imagedata").replace("\\", "");
			break;
		case "annotations":
			fileExt = ".csv";
			data = request.getParameter("imagedata");
			break;
		}
			
		
		response.setHeader("Content-disposition","attachment; filename=SNAPP" + fileExt);
		response.setContentType("application/force-download");
//	    print $data; ??? what is this for?
	}
	
//	public void doPost() HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//}
}