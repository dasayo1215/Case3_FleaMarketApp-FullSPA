<?php

if (!function_exists('vite')) {
    function vite($assets)
    {
        $devServer = 'http://localhost:5173';

        // ローカル環境では常に dev server を使う！
        if (app()->environment('local')) {
            $tags = '';
            foreach ((array)$assets as $asset) {
                $url = $devServer . '/' . ltrim($asset, '/');
                if (str_ends_with($asset, '.css')) {
                    $tags .= "<link rel=\"stylesheet\" href=\"{$url}\">" . PHP_EOL;
                } else {
                    $tags .= "<script type=\"module\" src=\"{$url}\"></script>" . PHP_EOL;
                }
            }
            return $tags;
        }

        // 本番（ビルド済み）
        $manifestPath = public_path('build/manifest.json');

        if (!file_exists($manifestPath)) {
            return '<!-- vite manifest not found -->';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $tags = '';
        foreach ((array)$assets as $asset) {
            $entry = $manifest[$asset] ?? null;
            if (!$entry) continue;

            if (isset($entry['css'])) {
                foreach ($entry['css'] as $css) {
                    $tags .= '<link rel="stylesheet" href="' . asset("build/{$css}") . '">' . PHP_EOL;
                }
            }
            $tags .= '<script type="module" src="' . asset("build/{$entry['file']}") . '"></script>' . PHP_EOL;
        }

        return $tags;
    }
}
