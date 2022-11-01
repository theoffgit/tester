<?php

// Выводит таблицу методов (response, request)...  первая колонка - всего изменений...  вторая предпоследнее изменение (если ниче не менялось с первого выкачивания 
// равно последнему)...    третья последнее изменение...  если для request нет параметров показывает "-"...  вторая и третья колонка - по ссылкам конкретный метод за конкретную дату...
// ссылка в первой колонке - все зафиксированные изменения respose, request... если дата последнего изменения из сегодня - ячейка красного цвета...

	$result = array();
	$methods = glob("data/methods/*");
//	print_r($methods);
	foreach($methods as $method){
		$tmp = explode('/', $method);
		$methodName = end($tmp);
		//echo $methodName."\n";
		if(is_dir($method."/resp/")){
			$responses = scandir($method."/resp/", SCANDIR_SORT_DESCENDING);
		//	print_r($responses);
		}

		$currResp = file_get_contents($method."/resp/".$responses[0]);
		$result[$methodName]['responses'][] = str_replace('.txt', '', $responses[0]);
		array_shift($responses);
		foreach($responses as $fileName){
			if(strpos($fileName, '.txt') !== false){
				$tmpResp = file_get_contents($method."/resp/".$fileName);
				if($currResp != $tmpResp){
					$result[$methodName]['responses'][] = str_replace('.txt', '', $fileName);
					$currResp = $tmpResp;
				}
			}
		}
		$size = count($result[$methodName]['responses']);
		if($size >= 2){
			array_splice($result[$methodName]['responses'], 2);
			$result[$methodName]['responses'][] = $size;
		}else if($size == 1){
			$result[$methodName]['responses'][] = $result[$methodName]['responses'][0];
			$result[$methodName]['responses'][] = 1;
		}else{
			echo "lazha 1\n";
			exit;
		}

		if(is_dir($method."/req/")){
			$requestes = scandir($method."/req/", SCANDIR_SORT_DESCENDING);

			$currReq = file_get_contents($method."/req/".$requestes[0]);
			$result[$methodName]['requestes'][] = str_replace('.txt', '', $requestes[0]);
			array_shift($requestes);
			foreach($requestes as $fileName){
				if(strpos($fileName, '.txt') !== false){
					$tmpReq = file_get_contents($method."/req/".$fileName);
					if($currReq != $tmpReq){
						$result[$methodName]['requestes'][] = str_replace('.txt', '', $fileName);
						$currReq = $tmpReq;
					}
				}
			}

			$size = count($result[$methodName]['requestes']);
			if($size >= 2){
				array_splice($result[$methodName]['requestes'], 2);
				$result[$methodName]['requestes'][] = $size;
			}else{
				$result[$methodName]['requestes'][] = $result[$methodName]['requestes'][0];
				$result[$methodName]['requestes'][] = 1;
			}
		}else{
			$result[$methodName]['requestes'][] = "-";
			$result[$methodName]['requestes'][] = "-";
			$result[$methodName]['requestes'][] = 0;
		}
	}

//	print_r($result);
	$today = date("Y-m-d");

	echo "<html><head><title>Methods Table</title></head><body><table><tr><td>Название Метода</td><td>Всего Изменений</td><td>Предпоследнее Изменение</td><td>Последнее Изменение</tr></tr>";
	foreach($result as $method => $data){
		echo "<tr><td>".$method." request</td><td>".($result[$method]['requestes'][2] > 0 ? '<a href="show.php?method='.$method.'" target=_blank>'.$result[$method]['requestes'][2].'</a>' : '0')."</td><td>".($result[$method]['requestes'][2] > 0 ? '<a href="show.php?method='.$method.'&date='.$result[$method]['requestes'][1].'" target=_blank>'.$result[$method]['requestes'][1].'</a>' : '-')."</td><td".(strtotime(str_replace('_',' ',$result[$method]['requestes'][0])) > strtotime($today) ? ' bgcolor="red"' : '').">".($result[$method]['requestes'][2] > 0 ? '<a href="show.php?method='.$method.'&date='.$result[$method]['requestes'][0].'" target=_blank>'.$result[$method]['requestes'][0].'</a>' : '-')."</td></tr>";
		echo "<tr><td>".$method." response</td><td>".($result[$method]['responses'][2] > 0 ? '<a href="show.php?method='.$method.'" target=_blank>'.$result[$method]['responses'][2].'</a>' : '0')."</td><td>".($result[$method]['responses'][2] > 0 ? '<a href="show.php?method='.$method.'&date='.$result[$method]['responses'][1].'" target=_blank>'.$result[$method]['responses'][1].'</a>' : '-')."</td><td".(strtotime(str_replace('_',' ',$result[$method]['responses'][0])) > strtotime($today) ? ' bgcolor="red"' : '').">".($result[$method]['responses'][2] > 0 ? '<a href="show.php?method='.$method.'&date='.$result[$method]['responses'][0].'" target=_blank>'.$result[$method]['responses'][0].'</a>' : '-')."</td></tr>";
	}
	echo "</table></body></html>";

?>