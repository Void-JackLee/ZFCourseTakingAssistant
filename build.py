#!/usr/bin/python3

#
#  build.py
#  抢课助手
#
#  Created by 李弘辰 on 2021/6/30.
#  Copyright © 2021 李弘辰. All rights reserved.
#  Learn more on website https://void-lee.cn
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License along
#  with this program; if not, write to the Free Software Foundation, Inc.,
#  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#

import json
import os

print('Building by webpack...')
os.system('webpack')
print('Converting to Tampermonkey script...')

f = open('package.json','r',encoding='utf8')
info = json.load(f)
f.close()

header = """// ==UserScript==
// @name         抢课助手
// @namespace    https://void-lee.cn
// @version      """ + info["version"] + """
// @description  """ + info["description"] + """
// @author       VoidJackLee
// @match        */jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
"""

print(header)

f = open('dist.js','r',encoding='utf8')
f2 = open('抢课助手.user.js','w',encoding='utf8')
f2.write(header)
for lines in f:
	f2.write(lines)

f.close()
f2.close()
print('Done!')