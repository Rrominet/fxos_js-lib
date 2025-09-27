function ext(filepath)
{
	let tmp = filepath.split("."); 
	return tmp[tmp.length -1];
}

function name(filepath)
{
	let tmp = filepath.split("/"); 
	return tmp[tmp.length -1];
}

function nameNoExt(filepath)
{
	return name(filepath).split(".")[0];
}