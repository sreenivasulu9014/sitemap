<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$url = $_GET['url'] ?? '';
if (!$url) {
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['error' => 'Invalid URL format']);
    exit;
}

$parsed = parse_url($url);
$baseDomain = $parsed['scheme'] . '://' . $parsed['host'];
$visited = [];
$allUrls = [];
$skippedUrls = [];
$allImages = [];
$brokenLinks = [];

function crawlPage($pageUrl, $baseDomain, &$visited, &$allUrls, &$skippedUrls, &$allImages, &$brokenLinks, $depth = 0, $maxDepth = 5) {
    if ($depth > $maxDepth || count($visited) > 1000) return;
    
    $normalizedUrl = rtrim($pageUrl, '/');
    $normalizedUrl = strtok($normalizedUrl, '#');
    
    if (in_array($normalizedUrl, $visited)) return;
    $visited[] = $normalizedUrl;
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $normalizedUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => 'XML-Sitemaps-Crawler/3.0',
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_MAXREDIRS => 10
    ]);
    
    $html = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $shouldSkip = false;
    if ($httpCode >= 400) {
        $brokenLinks[] = $normalizedUrl;
        $shouldSkip = true;
    }
    
    if ($html && preg_match('/<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i', $html)) {
        $shouldSkip = true;
    }
    
    if ($shouldSkip) {
        $skippedUrls[] = $normalizedUrl;
        return;
    }
    
    $allUrls[] = $normalizedUrl;
    
    if (!$html || $httpCode !== 200) return;
    
    preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $imgMatches);
    foreach ($imgMatches[1] as $img) {
        if (strpos($img, 'http') !== 0) {
            $img = rtrim($baseDomain, '/') . '/' . ltrim($img, '/');
        }
        if (preg_match('/\.(jpg|jpeg|png|gif|webp|svg|bmp)/i', $img)) {
            $allImages[] = $img;
        }
    }
    
    preg_match_all('/<a\s+(?:[^>]*?\s+)?href=["\']([^"\']+)["\']/i', $html, $linkMatches);
    
    foreach ($linkMatches[1] as $link) {
        if (empty($link) || $link === '#' || strpos($link, 'javascript:') === 0 || 
            strpos($link, 'mailto:') === 0 || strpos($link, 'tel:') === 0) {
            continue;
        }
        
        if (strpos($link, 'http') !== 0) {
            $link = rtrim($baseDomain, '/') . '/' . ltrim($link, '/');
        }
        
        $link = rtrim(strtok($link, '#'), '/');
        
        if (strpos($link, $baseDomain) !== false && !in_array($link, $visited)) {
            crawlPage($link, $baseDomain, $visited, $allUrls, $skippedUrls, $allImages, $brokenLinks, $depth + 1, $maxDepth);
        }
    }
}

crawlPage($url, $baseDomain, $visited, $allUrls, $skippedUrls, $allImages, $brokenLinks);

$allUrls = array_values(array_unique($allUrls));
$allImages = array_values(array_unique($allImages));
$skippedUrls = array_values(array_unique($skippedUrls));

$totalDiscovered = count($allUrls) + count($skippedUrls);
$addedCount = count($allUrls);
$skippedCount = count($skippedUrls);

echo json_encode([
    'success' => true,
    'domain' => $baseDomain,
    'total_urls' => $totalDiscovered,
    'added_count' => $addedCount,
    'skipped_count' => $skippedCount,
    'total_images' => count($allImages),
    'broken_links' => count($brokenLinks),
    'urls' => $allUrls,
    'skipped_urls' => $skippedUrls,
    'images' => $allImages
], JSON_PRETTY_PRINT);
?>
