﻿using Cards.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cards.Web.Controllers
{
    public class AreasController : Controller
    {
        //
        // GET: /Areas/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Edit(int id = 0)
        {
            ViewBag.AreaID = id;

            return View();
        }

    }
}
