############################################################### 
# 
# Module with nested namespaces that can be safely extended
# http://addyosmani.com/blog/essential-js-namespacing/
# http://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/
# 
# 1. Define modules, which will often be
#     module "OJP"
#     module "ApplicationName"
# 
# 2. Extend any modules with subclasses, such as
#     extend(Powderbird, "Powderbird.Reservations")
# 
# 
############################################################### 

module = (namespace) ->
  window[namespace] = window[namespace] or {}


extend = (ns, ns_string) ->
  parts = ns_string.split(".")
  parent = ns
  pl = undefined
  i = undefined
  parts = parts.slice(1)  if parts[0] is "com"

  pl = parts.length
  i = 0
  while i < pl
  
    #create a property if it doesnt exist
    if typeof parent[parts[i]] is "undefined"
      parent[parts[i]] = {}
    parent = parent[parts[i]]
    i++

  # return
  parent


# First define modules. Module creates an object of the name passed in.
module "com"

# extend modules with a deeply nested namespace
lucastswick = extend(com, "com.lucastswick")

# the correct object with nested depths is output


# minor test to check the instance of reservationsModule is an instance of the desired class
# console.log "should be true :: ", reservationsModule is Powderbird.Reservations

