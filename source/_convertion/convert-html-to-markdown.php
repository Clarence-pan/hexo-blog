<?php

chdir('../_posts');
$files = scandir('.');
foreach ($files as $file) {
    if (preg_match('/^p_(\d+)_(\d+)_(\d+).*\.html/', $file, $matches)){
        list(,$year, $month, $day) = $matches;
        $date = sprintf("%s-%s-%s", $year, $month, $day);
        $fileMd = basename($file, '.html').'.md';
        system("pandoc -f html -t markdown_github -o $fileMd $file");
        if (!file_exists($fileMd)){
            echo "Error: $fileMd convertion failed!".PHP_EOL;
        } else {
            $postContentLines = file($fileMd);
            $title = array_shift($postContentLines);
			array_shift($postContentLines);
            file_put_contents($fileMd, "title: ".trim($title, PHP_EOL).PHP_EOL.
                                       "date: ".$date.PHP_EOL.
									   "---".PHP_EOL.
                                       implode($postContentLines));
            echo "Done: ".$fileMd.PHP_EOL;
        }
    }
}

