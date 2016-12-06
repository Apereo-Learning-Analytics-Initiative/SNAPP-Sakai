package org.apereo.learninganalytics.snapp.filesaver;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet for SNAPP that downloads the file
 *
 */
public class FileSaver extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		byte[] data = null;
		
		String fileExt = request.getParameter("fileext");
		String imageData = request.getParameter("imagedata");
		if(StringUtils.isBlank(fileExt)) {
			throw new IllegalArgumentException("fileext must be specified");
		}
		
		switch (fileExt) {
			case "jpg": 
				data = decode(imageData);
				break;
			case "png": 
				data = decode(imageData);
				break;
			case "vna":
				data = deslash(imageData);
				break;
			case "gexf":
				data = deslash(imageData);
				break;
			case "annotations":
				data = imageData.getBytes();
				break;
			default:
				throw new IllegalArgumentException("Unsupported fileext");
		}
		
		response.setHeader("Content-disposition","attachment; filename=SNAPP." + fileExt);
		response.setContentType("application/force-download");
		
		OutputStream output = response.getOutputStream();
	    output.write(data);
	    output.close();
	}
	
	private byte[] decode(String s) {
		return Base64.getDecoder().decode(s);
	}
	
	private byte[] deslash(String s) {
		return s.replace("\\", "").getBytes();
	}
	

}