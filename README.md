# Edit.markdown
它是一个基于PC桌面的Markdown的文本编辑器，这个说明文档就是用它进行编辑的。edit.markdown是在windows10
环境下开发的，目前还不支持非Windows环境，建议屏幕分辨率1920\*1080以上。
***
![Alt text](https://github.com/guot/edit.markdown/blob/master/screenshot/screenshot1.PNG?raw=true)

## 安装


你可以从[Release](https://github.com/guot/edit.marketdown/releases)下载程序文件，解压后执行EditMarkdown.exe运行程序。 

## 已实现的功能
 
* **多文件编辑：** 可以对多个文件进行编辑，方便的文件切换。  
* **语法高亮：** 在进行Markdown编辑时，编辑器会自动识别Markdown标记，并显示不同颜色以示区别。
* **自动记忆最后编辑文件** 当每次打开编辑器时，会自动打开最后编辑的文件。
* **实时预览：**在编辑文本时可打开实时预览窗口，会自动同步显示解析后的Markdown文本的结果。
* **预览窗口跟随：**当主窗口进行移动或缩放时，预览窗口会动态跟随在主窗口的右侧，并自动调整大小。
* **预览内容快速定位：**当点击编辑内容的标题时，预览窗口会自动滚动到相应的位置。
* **预览结果导出功能 ** 预览结果可导出到HTML文件中，导出结果不带有样式，方便后期自定义样式。

## 使用的开源框架及组件

1. [nodejs](https://nodejs.org)是运行在服务端的 JavaScript
2. [electron](http://electron.atom.io/) 可以用js开发桌面应用
3. [angular.js](https://github.com/angular/angular.js) mvvm 框架
4. [codeMirror](http://codemirror.net/) js文本编辑组件
5. [gulp](http://gulpjs.com/) 后端编译打包工具
6. [bower](https://bower.io/) 前端包引用工具
7. [scss](http://sass-lang.com/) CSS编译程序
8. [flat-ui](http://www.flat-ui.com/) UI界面组件
9. [font-awesome](http://fontawesome.io/) 矢量字体集

## 待开发功能

1. 文件保存[已完成]
2. 版本发布[已完成]
3. 实时预览[已完成]
4. 通用搜索功能
5. 新建空白文档[已完成]
6. 全部保存 ：点击全部保存时，编辑器会自动保存变更的文本文件。
7. 文件外部修改检测： 当打的文件，被其它文本编辑器修改后，它会自动提示你是否重新加载。
 
## 项目开发环境依赖

 
- nodejs ^6.2.2    
- npm ^3.10.3      
- electron 1.2.5c
 

## 程序运行
### 初始安装
 打开命令行窗口如powershell输入以下命令。   
> git clone https://github.com/guot/edit.marketdown.git   
> cd guot/edit.marketdown   
> npm install   
> gulp  build:init   

### 开发实时编译预览

> gulp   
   

不要关闭窗口，程序会一直监控原代码的修改，并动态编译。
### 运行
新打开命令窗口
 
 >cd edit.marketdown   
 >./start.ps1   
 

## 变更列表
- 2016.7.27 
      1、增加导出预览结果到HTML文件的功能  
      2、增加编辑快捷键操作 CTRL1~4对应1~4级标题。
      3、增加编辑快捷键操作 CTRL+B 强调
      4、增加在预览窗口下按 CTRL+E快速复制生成内容到剪切板。 
- 2016.7.27 完成打包，发布版本1.00-alpha.1。
- 2016.7.26 完成新建文件功能。（可以在编辑器中创建Markdown文件）。
- 2016.7.25 完成预览窗口内容动态跟随编辑器内容（当点击编辑Marketdown视图时的标题内容时，
预览窗口内容跟随变更。   
- 2016.7.22 完成文件保存、实现预览、预览窗口跟随、窗口位置记忆功能。





