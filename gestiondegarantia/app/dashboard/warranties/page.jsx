"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Search, Download, Eye, PlusCircle, Filter, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function WarrantyManagement() {
  const { toast } = useToast()
  const [warranties, setWarranties] = useState([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [filteredWarranties, setFilteredWarranties] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" })

  useEffect(() => {
    const fetchWarranties = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/warranties?status=${filter}`)
        if (!response.ok) {
          throw new Error("Error fetching warranties")
        }
        const { data } = await response.json()
        setWarranties(data)
      } catch (error) {
        console.error("Error fetching warranties:", error)
        toast({
          title: "Error",
          description: "Could not load warranties",
          variant: "destructive",
        })
        // Use sample data in case of error
        setWarranties([
          {
            id: "warranty-1",
            customer_name: "John Doe",
            brand: "Samsung",
            model: "Galaxy S21",
            serial: "SN12345678",
            created_at: new Date().toISOString(),
            warranty_status: "pending",
            credi_memo: "CM001",
          },
          {
            id: "warranty-2",
            customer_name: "Jane Smith",
            brand: "Apple",
            model: "iPhone 13",
            serial: "AP98765432",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            warranty_status: "approved",
            credi_memo: "CM002",
          },
          {
            id: "warranty-3",
            customer_name: "Mike Johnson",
            brand: "LG",
            model: "Smart TV",
            serial: "LG12345678",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            warranty_status: "rejected",
            credi_memo: "CM003",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchWarranties()
  }, [filter, toast])

  useEffect(() => {
    let result = [...warranties]

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.customerName?.toLowerCase().includes(searchTerm) ||
          w.brand?.toLowerCase().includes(searchTerm) ||
          w.model?.toLowerCase().includes(searchTerm) ||
          w.serial?.toLowerCase().includes(searchTerm) ||
          w.crediMemo?.toLowerCase().includes(searchTerm),
      )
    }

    setFilteredWarranties(result)
  }, [warranties, filter, search, sortConfig])

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Warranty Management</h1>
        <Link href="/dashboard/warranties/new">
          <Button className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Warranty
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Warranty List</CardTitle>
            <CardDescription>Manage all warranties in the system</CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex items-center flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 text-gray-400" />
                <Input
                  placeholder="Search by customer, product, serial..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] border-blue-200">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warranties</SelectItem>
                    <SelectItem value="pending">Pending Warranties</SelectItem>
                    <SelectItem value="approved">Approved Warranties</SelectItem>
                    <SelectItem value="rejected">Rejected Warranties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-gray-700 dark:text-gray-300">Loading warranties...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-blue-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-50 dark:bg-blue-900/30">
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        onClick={() => requestSort("customerName")}
                      >
                        Customer
                        {sortConfig.key === "customerName" && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        onClick={() => requestSort("brand")}
                      >
                        Product
                        {sortConfig.key === "brand" && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        onClick={() => requestSort("createdAt")}
                      >
                        Date
                        {sortConfig.key === "createdAt" && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        onClick={() => requestSort("warrantyStatus")}
                      >
                        Status
                        {sortConfig.key === "warrantyStatus" && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        onClick={() => requestSort("crediMemo")}
                      >
                        Credit Memo
                        {sortConfig.key === "crediMemo" && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarranties.map((warranty) => (
                      <TableRow key={warranty.id}>
                        <TableCell>{warranty.customerName}</TableCell>
                        <TableCell>
                          <div className="font-medium">{warranty.brand}</div>
                          <div className="text-sm text-gray-500">{warranty.model}</div>
                        </TableCell>
                        <TableCell>{formatDate(warranty.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(warranty.warrantyStatus)}</TableCell>
                        <TableCell>{warranty.crediMemo || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/warranties/${warranty.id}`}>
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
