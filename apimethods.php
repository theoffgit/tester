<?php

	function compare($arrayNew, $arrayOld){
		$keysNew = array_keys($arrayNew);
		$keysOld = array_keys($arrayOld);

		$result = array_diff($keysNew, $keysOld);
		if(count($result)){
			echo "Methods diff:\n";
			print_r($result);
		}else{
			echo "No methods diff\n";
		}

		foreach($arrayNew as $k => $v){
			//echo $k."\n";
			if(isset($v['request']['text']) && isset($arrayOld[$k]['request']['text'])){
			//<---->print_r($v['request']['text']);
				$tmp1 = $v['request']['text'];
				$tmp2 = $arrayOld[$k]['request']['text'];
				$result = array_diff($tmp1, $tmp2);
				if(count($result)){
					echo $k."\n";
					print_r($result);
				}
			}else if((isset($v['request']['text']) && !isset($arrayOld[$k]['request']['text'])) || (!isset($v['request']['text']) && isset($arrayOld[$k]['request']['text']))){
				echo $k."\n";
				echo "diff!!!\n";
			}else{}
		}
	}

	$result = array();

	$content = file_get_contents('https://festa.alef.show/api/engine/apitester.php');
	$array = explode('<pre>', $content);
	array_shift($array);

	foreach($array as $val){
		$tmp = explode('</pre>', $val);
		$respjson = json_decode(str_replace('&quot;', '"', trim($tmp[0])), true);
		//echo json_encode($json)."\n";
		if(preg_match("/alef_action=([a-z]+)\!/is", $tmp[1], $matches)){
//			echo $matches[1]."\n";
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

	$files = scandir('data', SCANDIR_SORT_DESCENDING);
	$newest_file = $files[0];
	echo "last updated: ".$newest_file."\n";
	compare($result, json_decode(file_get_contents('data/'.$newest_file), true));

	file_put_contents('data/'.date("Y-m-d_H:i:s").'.txt', json_encode($result));
?>