<?php
// set headers
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');



$json = array(
	1 	=> 	array(
		"id"	=>	1,
		"word"		=> 	"Health",
		"heading_1"	=>	"Health&nbsp;Heading",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.google.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	2	=> 	array ("word" => "Something", "id" => 2),
	3	=> 	array ("word" => "Mental", "id" => 3),
	4	=> 	array ("word" => "Philosophy", "id" => 4),
	5	=> 	array ("word" => "Dolor", "id" => "5"),
	6	=> 	array ("word" => "Lorem", "id" => "6"),
	7	=> 	array ("word" => "Amet", "id" => "7"),
	8	=> 	array ("word" => "Consectetur", "id" => "8"),
	9	=> 	array ("word" => "Aenean", "id" => "9"),
	10	=> 	array ("word" => "Consectetur", "id" => "10"),
	11	=> 	array ("word" => "Amet", "id" => "11"),
	12	=> 	array ("word" => "Adipiscing", "id" => "12"),
	13	=> 	array ("word" => "Tincidunt", "id" => "13"),
	14	=> 	array ("word" => "Fringilla", "id" => "14"),
	15 	=> 	array(
		"id"	=>	"15",
		"word"		=> 	"Linked&nbsp;Heading",
		"heading_1"	=>	"Heading for this link",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	16	=> 	array ("word" => "Snicker", "id" => "16"),
	17	=> 	array ("word" => "Ruth", "id" => "17"),
	18	=> 	array ("word" => "Butterfinger", "id" => "18"),
	19	=> 	array ("word" => "Kitkat", "id" => "19"),
	20	=> 	array ("word" => "Environment", "id" => "20"),
	21 	=> 	array(
		"id"	=>	"21",
		"word"		=> 	"Word&nbsp;21",
		"heading_1"	=>	"Heading&nbsp;for&nbsp;this&nbsp;link",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	22 	=> 	array(
		"id"	=>	"22",
		"word"		=> 	"Word&nbsp;22",
		"heading_1"	=>	"Other&nbsp;Heading",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	23 	=> 	array(
		"id"	=>	"23",
		"word"		=> 	"Word&nbsp;with&nbsp;spaces",
		"heading_1"	=>	"Got&nbsp;a&nbsp;Heading!",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	24 	=> 	array(
		"id"	=>	"24",
		"word"		=> 	"Escape&nbsp;spaces",
		"heading_1"	=>	"Title&nbsp;of&nbsp;Popup",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	25	=> 	array(
		"id"	=>	"25",
		"word"		=> 	"Word_25",
		"heading_1"	=>	"Word_25&nbsp;Heading",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
	26 	=> 	array(
		"id"	=>	"26",
		"word"		=> 	"Word_26",
		"heading_1"	=>	"Important&nbsp;Info",
		"heading_2"	=>	"Sub-heading for this link",
		"content"	=>	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor mauris, sit amet imperdiet ipsum. Phasellus suscipit adipiscing massa vitae vulputate",
		"href"		=>	"www.yahoo.com",
		"img_src"	=>	"images/bg-popups-image.jpg"
	),
);

echo json_encode($json);


?>
