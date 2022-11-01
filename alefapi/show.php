<?php
	$method = ( isset($_REQUEST['method']) && preg_match("/^[a-z]+$/i", $_REQUEST['method'])) ? $_REQUEST['method'] : '';
	$date = ( isset($_REQUEST['date']) && preg_match("/^\d{4}\-\d{2}\-\d{2}\_\d{2}\:\d{2}\:\d{2}\$/i", $_REQUEST['date'])) ? $_REQUEST['date'] : '';

//	echo $method."<br />";
//	echo $date."<br />";
//	echo $_REQUEST['date'];

	if(!$method || !is_dir('data/methods/'.$method)){
		echo "existing method required";
		exit;
	}

	if($date){
		if(!file_exists('data/methods/'.$method.'/resp/'.$date.'.txt')){
			$date = '';
		}else{
			echo '<html><head><title>'.$method.'</title></head><body><h1>'.$method.'</h1><h2>RESPONSE</h2>';
			echo '<pre>';
			print_r(json_decode(file_get_contents('data/methods/'.$method.'/resp/'.$date.'.txt'),true));
			echo '</pre>';
			echo '<h2>REQUEST</h2>';
			if(file_exists('data/methods/'.$method.'/req/'.$date.'.txt')){
				echo '<pre>';
				print_r(json_decode(file_get_contents('data/methods/'.$method.'/req/'.$date.'.txt'),true));
				echo '</pre>';
			}else{
			    echo "no params";
			}
		}
	}


	if(!$date){
		echo "here!!!";
		$resp = glob("data/methods/".$method."/resp/*.txt");
		$req = glob("data/methods/".$method."/req/*.txt");
		echo '<html><head><title>'.$method.'</title></head><body><h1>'.$method.'</h1><h2>RESPONSES</h2>';
		$currCont = '';
		foreach($resp as $fileName){
			$tmpCont = file_get_contents($fileName);
			if($currCont != $tmpCont){
				echo '<h2>'.preg_replace("/[a-z\/\.]+/i", "", $fileName).'</h2>';
				echo '<pre>';
				print_r(json_decode($tmpCont,true));
				echo '</pre>';
				$currCont = $tmpCont;
			}
		}
		echo '<h2>REQUESTS</h2>';
		foreach($req as $fileName){
			$tmpCont = file_get_contents($fileName);
			if($currCont != $tmpCont){
				echo '<h2>'.preg_replace("/[a-z\/\.]+/i", "", $fileName).'</h2>';
				echo '<pre>';
				print_r(json_decode($tmpCont,true));
				echo '</pre>';
				$currCont = $tmpCont;
			}
		}
	}

?>