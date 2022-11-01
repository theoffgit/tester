<?php

// Забирает страницу https://festa.alef.show/api/engine/apitester.php... разбирает на методы...  раскладывает по папкам

	if(!is_dir('data')){
		mkdir('data'. 0777) or die ("can't make dir 'data'");
	}

	if(!is_dir('data/methods')){
		mkdir('data/methods', 0777) or die ("can't make dir 'data/methods'");
	}

	$result = array();

	$content = file_get_contents('https://festa.alef.show/api/engine/apitester.php');
	$array = explode('<pre>', $content);
	array_shift($array);

	foreach($array as $val){
		$tmp = explode('</pre>', $val);
		$respjson = json_decode(str_replace('&quot;', '"', trim($tmp[0])), true);
		if(preg_match("/alef_action=([a-z]+)\!/is", $tmp[1], $matches)){
			$method = $matches[1];
			$result[$method]['response'] = $respjson;
		}
		if(preg_match_all("/<input\s+type=\"text\"\s+name=\"([^\"]+)\"[^<>]+value=\"([^\"]+)\"/", $tmp[1], $matches)){
			//print_r($matches);
			foreach($matches[1] as $k => $v){
				if(strpos($matches[2][$k], '&quot;') !== false){
					$matches[2][$k] = str_replace('&quot;', '"', $matches[2][$k]);
				}
				$result[$method]['request']['text'][$v] = $matches[2][$k];
			}
		}

		if(preg_match_all("/<input\s+type=\"file\"\s+name=\"([^\"]+)\"/", $tmp[1], $matches)){
			//print_r($matches);
			foreach($matches[1] as $v){
				$result[$method]['request']['file'][] = $v;
			}
		}
	}

	$now = date("Y-m-d_H:i:s");

	file_put_contents('data/'.date("Y-m-d_H:i:s").'.txt', json_encode($result));

	foreach($result as $method => $methodData ){
		if(!is_dir('data/methods/'.$method)){
			mkdir('data/methods/'.$method) or die("can't make dir 'data/methods/'".$method);
			echo "NEW METHOD: ".$method."!!\n";
		}
		if(isset($methodData['response'])){
			if(!is_dir('data/methods/'.$method.'/resp')){
				mkdir('data/methods/'.$method.'/resp/') or die("can't make dir 'data/methods/'".$method.'/resp');
			}
			file_put_contents('data/methods/'.$method.'/resp/'.$now.'.txt', json_encode($methodData['response']));
		}
		if(isset($methodData['request'])){
			if(!is_dir('data/methods/'.$method.'/req')){
				mkdir('data/methods/'.$method.'/req') or die("can't make dir 'data/methods/'".$method.'/req');
			}
			file_put_contents('data/methods/'.$method.'/req/'.$now.'.txt', json_encode($methodData['request']));
		}
	}

?>