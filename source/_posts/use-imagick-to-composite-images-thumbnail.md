title: PHP下使用强大的imagick轻松生成组合缩略图
date: 2016-02-19
update: 
tags: 
  - PHP
  - imagick
  - thumbnail
categories: 
  - PHP
----

最近有个需求是要把多张图片组合起来生成缩略图，刚好可以用强大的`imagick`扩展。

<!-- more -->

这里说的`imagick` 是 `ImageMagick` 在PHP下的扩展。使用`pecl`安装起来那叫一个轻松简单 —— 一条命令就搞定：

```sh
sudo pecl install imagick
```

（扩展装好后还是要在php.ini中加上`extension=imagick.so`，然后记得重启`apache`或`PHP-fpm`服务。）

这个需求是要这样生成缩略图：

1. 如果有1张图片，就直接生成这张图片的缩略图；
2. 如果有2张图片，则一张在左边一张在右边，各一半；
3. 如果有3张图片，则两张左边平均分配，一张独占右边；
4. 如果有4张图片，则像田字格一样平均分配空间；
5. 更多张图片，则只取前4张，按田字格方式生成缩略图。

这规则还真不少，不过还不算太过复杂，很快搞出来了：

```PHP
namespace \clarence\thumbnail;
class Thumbnail extends \Imagick
{
    /**
     * @param array $images
     * @param int $width
     * @param int $height
     * @return static
     * @throws ThumbnailException
     */
    public static function createFromImages($images, $width, $height){
        if (empty($images)){
            throw new ThumbnailException("No images!");
        }

        $thumbnail = new static();
        $thumbnail->newImage($width, $height, 'white', 'jpg');
        $thumbnail->compositeImages($images);

        return $thumbnail;
    }

    public function compositeImages($images){
        $imagesKeys = array_keys($images);
        $compositeConfig = $this->calcCompositeImagesPosAndSize($images);

        foreach ($compositeConfig as $index => $cfg){
            $imgKey = $imagesKeys[$index];
            $img = new \Imagick($images[$imgKey]);
            $img = $this->makeCompositeThumbnail($img, $cfg);
            $this->compositeImage($img, self::COMPOSITE_OVER, $cfg['to']['x'], $cfg['to']['y']);
        }
    }

    protected function makeCompositeThumbnail(\Imagick $img, $cfg){
        $img->cropThumbnailImage($cfg['size']['width'], $cfg['size']['height']);
        return $img;
    }

    protected function calcCompositeImagesPosAndSize($images){
        $width = $this->getImageWidth();
        $height = $this->getImageHeight();

        switch(count($images)){
            case 0:
                throw new ThumbnailException("No images!");
            case 1:
                // | 0 |
                return [
                    0 => [
                        'to' => [ 'x' => 0, 'y' => 0 ],
                        'size' => [
                            'width' => $width,
                            'height' => $height,
                        ]
                    ]
                ];
            case 2:
                // | 0 | 1 |
                return [
                    0 => [
                        'to' => [ 'x' => 0, 'y' => 0 ],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height,
                        ]
                    ],
                    1 => [
                        'to' => [ 'x' => $width / 2, 'y' => 0],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height,
                        ]
                    ]
                ];
            case 3:
                // | 0 | 1 |
                // | 2 |   |
                return [
                    0 => [
                        'to' => [ 'x' => 0, 'y' => 0 ],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                    1 => [
                        'to' => [ 'x' => $width / 2, 'y' => 0],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height,
                        ]
                    ],
                    2 => [
                        'to' => [ 'x' => 0, 'y' => $height / 2 ],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                ];
            default:
                // >= 4:
                // | 0 | 1 |
                // | 2 | 3 |
                return [
                    0 => [
                        'to' => [ 'x' => 0, 'y' => 0 ],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                    1 => [
                        'to' => [ 'x' => $width / 2, 'y' => 0],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                    2 => [
                        'to' => [ 'x' => 0, 'y' => $height / 2 ],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                    3 => [
                        'to' => [ 'x' => $width / 2, 'y' => $height / 2],
                        'size' => [
                            'width' => $width / 2,
                            'height' => $height / 2,
                        ]
                    ],
                ];
        }
    }
}

```

用个试试：

```PHP
$thumbnail = \clarence\thumbnail\Thumbnail::createFromImages($srcImages, 240, 320);
$thumbnail->writeImage($outputDir."/example.jpg");

```

效果立马出来了：

![](/media/14558111792512/14558119572671.jpg)


赞一个~ 

（详细代码见 <http://github.com/clarence-pan/thumbnail>)


