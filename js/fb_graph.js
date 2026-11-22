class fb_graph
{
    static init()
    {
        if (!window.fbAsyncInit)
        {
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : fb_graph.APP_ID,
                    xfbml            : true,
                    version          : fb_graph.API_VERSION
                });
            };

            const sc = D.createElement("script");
            sc.async = true;
            sc.defer = true;
            sc.src = "https://connect.facebook.net/en_US/sdk.js";
            D.body.appendChild(sc);
        }
    }
    static get API_VERSION(){return "v20.0"}
    static get APP_ID(){return "735993365135002"}
    static get token(){return "EAAKdYc8VZCpoBO0JZBO76ZC9yzNlayRhJMoZANJky8XoDr0SCl1qvn0HKHOsd2sNIjFERdmZB1RNeF6z92JuRsW2zqmNjZBz6RDIz70ZC111BZCsB32cNKzUDubtVixKM7AUExWhA6rTWak7s5AaBzLsfpQHEmsUuO4a2ZBCFTTiuNPr3yVqUX0dkVdUcvuTXU25TvJGIu2YksmmG"}
    static get AD_ID(){return "75791088"}
    static base_url(){return "https://graph.facebook.com/" + fb_graph.API_VERSION + "/";}
    static ads_url(){return fb_graph.base_url() + "act_" + fb_graph.AD_ID + "/"}
    static ads_endpoint(){return "act_" + fb_graph.AD_ID + "/"}

    static request(endpoint, data, method="GET", cb)
    {
        const fdata = new FormData;
        for (const k in data)
        {
            if (typeof(data[k]) == "string")
                fdata.append(k, data[k]);
            else 
                fdata.append(k, JSON.stringify(data[k]));
        }
        fdata.append("access_token", fb_graph.token);
        const xhr = HttpRequest();

        const _cb = (xhr) => {
            const data = JSON.parse(xhr.responseText);
            cb(data);
        };
        if (method == "GET")
        {
            const query = fb_graph.base_url() + endpoint + "?" + request.asUrlString(fdata);
            xhr.sendAsGet(query, _cb);
        }
        else if (method == "POST")
        {
            xhr.addEventListener("readystatechange", ()=>
                {
                    if (xhr.readyState == XMLHttpRequest.DONE && _cb)
                        _cb(xhr);
                });
            xhr.open("POST", fb_graph.base_url() + endpoint, true);
            xhr.send(fdata);
        }
        else if (method == "DELETE")
        {
            xhr.open("DELETE", fb_graph.base_url() + endpoint, true);
            xhr.send(fdata);
        }
    }

    static ad_request(endpoint, data, method="GET", cb)
    {
        fb_graph.request(fb_graph.ads_endpoint() + endpoint, data, method, cb);
    }

    static ad_campaigns(data={effective_status:["ACTIVE", "PAUSED"], 
        fields:["id",
"account_id",
"adlabels",
"bid_strategy",
"boosted_object_id",
"brand_lift_studies",
"budget_rebalance_flag",
"budget_remaining",
"buying_type",
"campaign_group_active_time",
"can_create_brand_lift_study",
"can_use_spend_cap",
"configured_status",
"created_time",
"daily_budget",
"effective_status",
"has_secondary_skadnetwork_reporting",
"is_budget_schedule_enabled",
"is_skadnetwork_attribution",
"issues_info",
"last_budget_toggling_time",
"lifetime_budget",
"name",
"objective",
"pacing_type",
"primary_attribution",
"promoted_object",
"smart_promotion_type",
"source_campaign",
"source_campaign_id",
"special_ad_categories",
"special_ad_category",
"special_ad_category_country",
"spend_cap",
"start_time",
"status",
"stop_time",
"topline_id",
"updated_time",
        ]})
    {
        return new Promise((resolve) => fb_graph.ad_request("campaigns", data, "GET", resolve));
    }

    static ad_campaign(_id, fields=["id",
"account_id",
"adlabels",
"bid_strategy",
"boosted_object_id",
"brand_lift_studies",
"budget_rebalance_flag",
"budget_remaining",
"buying_type",
"campaign_group_active_time",
"can_create_brand_lift_study",
"can_use_spend_cap",
"configured_status",
"created_time",
"daily_budget",
"effective_status",
"has_secondary_skadnetwork_reporting",
"is_budget_schedule_enabled",
"is_skadnetwork_attribution",
"issues_info",
"last_budget_toggling_time",
"lifetime_budget",
"name",
"objective",
"pacing_type",
"primary_attribution",
"promoted_object",
"smart_promotion_type",
"source_campaign",
"source_campaign_id",
"special_ad_categories",
"special_ad_category",
"special_ad_category_country",
"spend_cap",
"start_time",
"status",
"stop_time",
"topline_id",
"updated_time",
    ])
    {
        const data = {fields : fields};
        return new Promise((resolve) => fb_graph.request(_id, data, "GET", resolve));
    }

    static ad_sets(data={fields : [
"id",
"name",
"daily_budget",
"lifetime_budget",
"optimization_goal",
    ]})
    {
        return new Promise((resolve) => fb_graph.ad_request("adsets", data, "GET", resolve));
    }

    //meta for meta_data
    static ad_meta(_id)
    {
        const data = {metadata : 1};
        return new Promise((resolve) => fb_graph.request(_id, data, "GET", resolve));
    }

    //if _id is null, it will return the infos for the ad account
    //from and to are date objects
    static ad_insights(_id=null, from=null, to=null, data={ 
        fields:["spend", "cpc", "cpm", "cpp", "ctr", "cost_per_unique_conversion", "frequency", "reach", "impressions"]
    })
    {
        if (!_id)
            _id = "act_" + fb_graph.AD_ID;
        if (to == null)
            to = new Date();
        if (from == null)
            from = new Date(to.getTime() - 365*24*60*60*1000); // by default last year range
        data.time_range = {since : from.toYYYYMMDD(), until : to.toYYYYMMDD()};
        return new Promise((resolve) => fb_graph.request(_id + "/insights", data, "GET", resolve));
    }

    static ad_videos(data={fields : ["id", "title"]})
    {
        return new Promise((resolve) => fb_graph.ad_request("advideos", data, "GET", resolve));
    }

    // can copy anything depending of the id given
    static ad_copy(_id, data={deep_copy : true})
    {
        return new Promise((resolve) => fb_graph.request(_id + "/copies", data, "POST", resolve));
    }

    // used to set any data to the object represented by the id
    static set(_id, data={})
    {
        return new Promise((resolve) => fb_graph.request(_id, data, "POST", resolve));
    }

    static ads(_id, data={fields : ["id", "name"]})
    {
        return new Promise((resolve) => fb_graph.request(_id + "/ads", data, "GET", resolve));
    }

    // the id is the ad id that can have several creatives attached to it.
    static creatives(_id, data={fields : ["object_url", "object_type", "name", "asset_feed_spec", "effective_instagram_story_id", "interactive_components_spec", "link_url", "status", "title", "thumbnail_id", "object_story_id", "object_story_spec", "degrees_of_freedom_spec", "recommender_settings", "product_set_id", "platform_customizations"]})
    {
        return new Promise((resolve) => fb_graph.request(_id + "/adcreatives", data, "GET", resolve));
    }

    static all_creatives(data={fields : ["object_url", "object_type", "name", "asset_feed_spec", "effective_instagram_story_id", "interactive_components_spec", "link_url", "status", "title", "thumbnail_id", "object_story_id", "object_story_spec", "degrees_of_freedom_spec", "recommender_settings", "product_set_id", "platform_customizations"]})
    {
        return new Promise((resolve) => fb_graph.ad_request("adcreatives", data, "GET", resolve));
    }
     
    static creative(_id, data={fields : ["object_url", "object_type", "name", "asset_feed_spec", "effective_instagram_story_id", "interactive_components_spec", "link_url", "status", "title", "thumbnail_id", "object_story_id", "object_story_spec", "degrees_of_freedom_spec", "recommender_settings", "product_set_id", "platform_customizations"]})
    {
        return new Promise((resolve) => fb_graph.request(_id, data, "GET", resolve));
    }

    // the id is the one of the creative sourced (not the ad)
    //data is the data you want to change from the original
    static async copy_creative(_id, data)
    {
        const creative = await fb_graph.creative(_id); 
        delete creative.id;
        const ndata = JSON.merged(creative, data);
        return new Promise((resolve) => fb_graph.ad_request("adcreatives", ndata, "POST", resolve));
    }

    static set_ad_creative(ad_id, creative_id)
    {
        const data = {creative : {"creative_id": creative_id}};
        return new Promise((resolve) => fb_graph.request(ad_id, data, "POST", resolve));
    }

    // any id that is supported.
    static delete(_id)
    {
        return new Promise((resolve) => fb_graph.request(_id, {}, "DELETE", resolve));
    }

    static async test(ad_id)
    {
        let creatives = await fb_graph.creatives(ad_id);
        creatives = creatives.data;

        const mod_data = {
            name : "copy_creative_test",
            asset_feed_spec : 
            {
                link_urls : [
                    {
                        website_url : "https://teach.motion-live.com/premiere-image/pres.html?from=fb_atat_v1.02"
                    }
                ],
                videos : [
                    {
                        video_id : "1224795442021097" // 9-16
                    },
                    {
                        video_id : "1224795442021097" // 9-16
                    },
                    {
                        video_id : "1554255485491798" // 3-4
                    },
                ]
            }
        };
       const ncreative_id = await fb_graph.copy_creative(creatives[0].id, mod_data);
       await fb_graph.set_ad_creative(ad_id, ncreative_id.id);
    }

}

fb_graph.init();
