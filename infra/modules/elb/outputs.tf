output "elb_dns_name" {
  description = "The DNS name of the ELB"
  value       = aws_elb.main.dns_name
}